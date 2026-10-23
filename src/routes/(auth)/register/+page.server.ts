import { userService } from "$lib/server/services/identity/user.service.js";
import { sessionService } from "$lib/server/services/identity/session.service.js";
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE,
} from "../../../hooks.server.js";
import { RegisterSchema } from "$lib/schemas/auth.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { parseJwt } from "$lib/utils/jwt.js";
import { resolveRedirectPath } from "$lib/utils/resolve-redirect-path.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch, locals }) => {
		const formData = await request.formData();
		const name = formData.get("name")?.toString() || "";
		const email = formData.get("email")?.toString() || "";
		const username = formData.get("username")?.toString() || "";
		const password = formData.get("password")?.toString() || "";

		const parseResult = RegisterSchema.safeParse({
			name,
			email,
			username,
			password,
			role: "admin",
		});

		if (!parseResult.success) {
			const firstError = parseResult.error.issues[0]?.message || "Input tidak valid";
			return fail(400, {
				message: firstError,
				values: { name, email, username },
			});
		}

		try {
			// 1. Daftarkan user via POST /api/v1/users
			await userService.create(
				{
					full_name: parseResult.data.name,
					email: parseResult.data.email,
					username: parseResult.data.username,
					password: parseResult.data.password,
					role: parseResult.data.role,
				},
				undefined,
				{ fetch }
			);

			// 2. Auto-login langsung setelah registrasi berhasil
			const deviceId = formData.get("deviceId")?.toString() || locals.deviceId || "web-client";
			const deviceName = formData.get("deviceName")?.toString() || locals.deviceName || "Web Browser";

			const loginResult = await sessionService.createSession(
				{
					identity: parseResult.data.username,
					password: parseResult.data.password,
				},
				{
					fetch,
					deviceId,
					deviceName,
				}
			);

			const isSecure = process.env.NODE_ENV === "production";

			cookies.set(ACCESS_TOKEN_COOKIE, loginResult.accessToken, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: isSecure,
				maxAge: loginResult.expiresIn || 60 * 60 * 24,
			});

			if (loginResult.refreshToken) {
				cookies.set(REFRESH_TOKEN_COOKIE, loginResult.refreshToken, {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: isSecure,
					maxAge: 60 * 60 * 24 * 30,
				});
			}

			const parsedJwt = parseJwt(loginResult.accessToken);
			if (parsedJwt) {
				const userProfile = {
					user_id: String(parsedJwt.user_id),
					full_name: parsedJwt.full_name || parsedJwt.user_code || parseResult.data.name,
					email: parseResult.data.email,
					role_code: parsedJwt.role_code ? String(parsedJwt.role_code) : null,
					tenantId: parsedJwt.tenant_id ? String(parsedJwt.tenant_id) : null,
					tenantCode: parsedJwt.tenant_code || null,
					branchId: parsedJwt.branch_id ? String(parsedJwt.branch_id) : null,
					branchCode: parsedJwt.branch_code || null,
				};

				cookies.set(USER_COOKIE, JSON.stringify(userProfile), {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: isSecure,
					maxAge: 60 * 60 * 24 * 7,
				});
			}

			const target = resolveRedirectPath(parsedJwt?.role_code);
			redirect(302, target);
		} catch (err: any) {
			if (err?.status === 302 || err?.location) throw err;
			if (err instanceof ApiError) {
				return fail(err.status, {
					message: err.message,
					errors: err.errors,
					values: { name, email, username },
				});
			}
			return fail(400, {
				message: err?.message || "Gagal melakukan registrasi",
				values: { name, email, username },
			});
		}
	},
};
