import { error, redirect, type Handle, type HandleFetch, type HandleServerError } from "@sveltejs/kit";
import { parseJwt, isJwtExpired } from "$lib/utils/jwt.js";
import { sessionService } from "$lib/server/services/identity/session.service.js";
import { ApiError } from "$lib/server/api/client.js";
import { getAuthTokens, getUserContext } from "$lib/utils/getCookies";
import { canAccessPage } from "$lib/rbac";
import { runWithRequestContext } from "$lib/server/context.js";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const USER_COOKIE = "auth_user";
export const DEVICE_ID_COOKIE = "device_id";

// ============================================================================
// 1. HELPER AUTO-REFRESH TOKEN & UPDATE COOKIES
// ============================================================================
async function refreshAuthSession(cookies: import("@sveltejs/kit").Cookies, customFetch?: typeof fetch) {
	const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);
	if (!refreshToken) return null;

	try {
		const tokens = await sessionService.refreshSession(refreshToken, {
			fetch: customFetch,
		});

		cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: tokens.expiresIn || 60 * 60 * 24,
		});

		if (tokens.refreshToken) {
			cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30,
			});
		}

		const claims = parseJwt(tokens.accessToken);
		if (claims) {
			const userProfile = {
				user_id: String(claims.user_id),
				full_name: claims.full_name || claims.user_code || "User",
				email: `${claims.user_code}@parkir.local`,
				role_code: claims.role_code ? String(claims.role_code) : null,
				tenantId: claims.tenant_id ? String(claims.tenant_id) : null,
				tenantCode: claims.tenant_code || null,
				branchId: claims.branch_id ? String(claims.branch_id) : null,
				branchCode: claims.branch_code || null,
			};

			cookies.set(USER_COOKIE, JSON.stringify(userProfile), {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7,
			});
		}

		return tokens;
	} catch (refreshErr) {
		console.error("[BFF Middleware] Gagal auto-refresh token:", refreshErr);
		cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" });
		cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" });
		cookies.delete(USER_COOKIE, { path: "/" });
		return null;
	}
}

// ============================================================================
// 2. MAIN BFF MIDDLEWARE (Auth, Auto-Refresh Token, & Central Request Context)
// ============================================================================
export const handle: Handle = async ({ event, resolve }) => {
	// A. Ekstrak Bearer token dari Cookie atau Header Authorization
	const authHeader = event.request.headers.get("authorization") || event.request.headers.get("Authorization");
	let accessToken = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : (event.cookies.get(ACCESS_TOKEN_COOKIE) || null);
	const refreshToken = event.cookies.get(REFRESH_TOKEN_COOKIE) || null;

	const claims = parseJwt(accessToken);

	// B. Auto-refresh jika token tidak valid/expired tapi ada refreshToken
	if ((!claims || isJwtExpired(claims)) && refreshToken) {
		const refreshed = await refreshAuthSession(event.cookies, event.fetch);
		if (refreshed) {
			accessToken = refreshed.accessToken;
		}
	}

	// C. Device Context (Diperlukan oleh park-server-v3)
	let deviceId = event.cookies.get(DEVICE_ID_COOKIE) || event.request.headers.get("x-device-id") || null;
	if (!deviceId) {
		deviceId = "web-" + crypto.randomUUID().slice(0, 18);
		event.cookies.set(DEVICE_ID_COOKIE, deviceId, {
			path: "/",
			httpOnly: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 365,
		});
	}
	const deviceName = event.request.headers.get("x-device-name") || "Web Browser";
	const requestId = event.request.headers.get("x-request-id") || crypto.randomUUID();

	event.locals.deviceId = deviceId;
	event.locals.deviceName = deviceName;

	// D. Pengecekan sesi murni dari Cookies / Context
	const userContext = getUserContext(event.cookies);
	const isAuthenticated = Boolean(userContext && accessToken);

	// E. Centralized Route Guard
	const pathname = event.url.pathname;
	const isAuthRoute =
		pathname.startsWith("/login") ||
		pathname.startsWith("/register") ||
		pathname.startsWith("/forgot-password") ||
		pathname.startsWith("/reset-password") ||
		pathname.startsWith("/m/login");

	const isPublicRoute =
		pathname === "/" ||
		pathname === "/pricing" ||
		pathname.startsWith("/pricing") ||
		pathname.startsWith("/m/customer") ||
		pathname.startsWith("/m/ticket");

	// Jika belum login (cookies tidak ada) tapi mengakses halaman privat -> redirect ke login
	if (!isAuthenticated && !isAuthRoute && !isPublicRoute && !pathname.startsWith("/api")) {
		if (pathname.startsWith("/m")) {
			redirect(302, "/m/login");
		}
		redirect(302, "/login");
	}

	// Jika sudah login tapi mengakses halaman auth -> redirect ke dashboard sesuai role
	if (isAuthenticated && isAuthRoute && userContext) {
		const rawRole = (userContext.roleCode || "").toUpperCase();
		if (rawRole.includes("OFFICER") || rawRole.includes("JUKIR")) {
			redirect(302, "/m/jukir");
		} else if (rawRole.includes("TENANT")) {
			redirect(302, "/dashboard/tenant");
		} else if (rawRole.includes("BRANCH")) {
			redirect(302, "/dashboard/branch");
		} else if (rawRole.includes("SYSTEM") || rawRole.includes("SUPER")) {
			redirect(302, "/dashboard/system");
		} else if (rawRole.includes("CUSTOMER")) {
			redirect(302, "/m/customer");
		} else {
			redirect(302, "/");
		}
	}

	// F. RBAC Permission Check (Berdasarkan PAGE_ROLES)
	if (isAuthenticated && userContext && !pathname.startsWith("/api") && !isPublicRoute) {
		if (!canAccessPage(pathname, userContext.roleCode)) {
			console.warn(`[RBAC FORBIDDEN] Path: ${pathname}, User: ${userContext.fullName}, RoleCode: '${userContext.roleCode}'`);
			error(403, "Anda tidak memiliki akses ke halaman ini");
		}
	}

	// G. Jalankan request di dalam serverContext (AsyncLocalStorage)
	const contextStore = {
		token: accessToken,
		deviceId,
		deviceName,
		requestId,
		user: userContext,
		cookies: event.cookies,
	};

	return runWithRequestContext(contextStore, async () => {
		const response = await resolve(event);

		// Trigger auto-refresh jika server merespons 401 Unauthorized
		if (response.status === 401 && event.cookies.get(REFRESH_TOKEN_COOKIE)) {
			await refreshAuthSession(event.cookies, event.fetch);
		}

		return response;
	});
};

// ============================================================================
// 3. FETCH INTERCEPTOR (1:1 park-server-v3 Headers & Auto-Retry on 401)
// ============================================================================
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const userContext = getUserContext(event.cookies);
	const { accessToken } = getAuthTokens(event.cookies);

	// A. Headers Standar Backend Go (park-server-v3)
	const isFormData = typeof request.body === "object" && request.headers.get("content-type")?.includes("multipart/form-data");
	if (!isFormData && !request.headers.has("Content-Type")) {
		request.headers.set("Content-Type", "application/json");
	}
	if (!request.headers.has("Accept")) {
		request.headers.set("Accept", "application/json, */*");
	}

	// Bypass ngrok warning page
	request.headers.set("ngrok-skip-browser-warning", "true");

	// B. Bearer Authorization
	if (accessToken && !request.headers.has("Authorization")) {
		request.headers.set("Authorization", `Bearer ${accessToken}`);
	}

	// C. Device & Tracing Headers
	const deviceId = (event.locals as any)?.deviceId || event.cookies.get(DEVICE_ID_COOKIE) || "web-browser";
	const deviceName = (event.locals as any)?.deviceName || "Web Browser";
	if (!request.headers.has("X-Device-ID")) {
		request.headers.set("X-Device-ID", deviceId);
	}
	if (!request.headers.has("X-Device-Name")) {
		request.headers.set("X-Device-Name", deviceName);
	}
	if (!request.headers.has("X-Request-ID")) {
		request.headers.set("X-Request-ID", crypto.randomUUID());
	}

	// D. Header Konteks Tenant & Branch (dari userContext)
	if (userContext?.tenantId && !request.headers.has("x-tenant-id")) {
		request.headers.set("x-tenant-id", String(userContext.tenantId));
	}
	if (userContext?.tenantCode && !request.headers.has("x-tenant-code")) {
		request.headers.set("x-tenant-code", userContext.tenantCode);
	}
	if (userContext?.branchId && !request.headers.has("x-branch-id")) {
		request.headers.set("x-branch-id", String(userContext.branchId));
	}
	if (userContext?.branchCode && !request.headers.has("x-branch-code")) {
		request.headers.set("x-branch-code", userContext.branchCode);
	}
	if (userContext?.userId && !request.headers.has("x-user-id")) {
		request.headers.set("x-user-id", String(userContext.userId));
	}
	if (userContext?.roleCode && !request.headers.has("x-role-code")) {
		request.headers.set("x-role-code", userContext.roleCode);
	}

	// E. Clone request sebelum fetch agar body tetap tersedia untuk retry jika terjadi 401
	const isRefreshEndpoint = request.url.includes("/users/auth/refresh");
	const canRetry = !isRefreshEndpoint && Boolean(event.cookies.get(REFRESH_TOKEN_COOKIE));
	const requestClone = canRetry ? request.clone() : null;

	let response = await fetch(request);

	// Auto-retry on 401 Unauthorized
	if (response.status === 401 && canRetry && requestClone) {
		console.warn(`[handleFetch] Server merespons 401 Unauthorized pada ${request.url}. Menjalankan auto-refresh token...`);
		const newTokens = await refreshAuthSession(event.cookies, fetch);

		if (newTokens?.accessToken) {
			const retryHeaders = new Headers(requestClone.headers);
			retryHeaders.set("Authorization", `Bearer ${newTokens.accessToken}`);

			const retryRequest = new Request(requestClone, {
				headers: retryHeaders,
			});

			response = await fetch(retryRequest);
		}
	}

	return response;
};

// ============================================================================
// 4. GLOBAL ERROR HANDLER
// ============================================================================
export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();
	console.error(`[Server Error ${errorId}] at ${event.url.pathname}:`, error);

	if (error instanceof ApiError) {
		return {
			message: error.message,
			status: error.status,
			errorId,
		};
	}

	return {
		message: (error as Error)?.message || message || "Terjadi kesalahan internal pada server.",
		status: status || 500,
		errorId,
	};
};
