import { sessionService } from "$lib/server/services/identity/session.service";
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE,
} from "../../../hooks.server.ts";
import { LoginSchema } from "$lib/schemas/auth.schema.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { parseJwt } from "$lib/utils/jwt";


export const load: PageServerLoad = async () => {
	return {
		enabledProviders: [] as string[],
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, fetch, locals, url }) => {
		const formData = await request.formData();
		const rawIdentity = formData.get("username");
		const rawPassword = formData.get("password");
		const redirectTo = url.searchParams.get("redirectTo") || formData.get("redirectTo")?.toString() || null;
		// Validasi dengan Zod Schema
		const parseResult = LoginSchema.safeParse({
			identity: rawIdentity,
			password: rawPassword,
		});
      if (!parseResult.success) {
         const firstError = parseResult.error.issues[0]?.message || "Input tidak valid";
         return fail(400, { message: firstError });
		}

		const { identity, password } = parseResult.data;
		const deviceId = formData.get("deviceId")?.toString() || locals.deviceId || "web-client";
		const deviceName = formData.get("deviceName")?.toString() || locals.deviceName || "Web Browser";

		const result = await sessionService.createSession(
			{ identity, password },
			{
				fetch,
				deviceId,
				deviceName,
			}
		);

		if (!result || !result.accessToken) {
			return fail(400, { message: "Gagal membuat sesi login" });
		}

		const isSecure = process.env.NODE_ENV === "production";
		cookies.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: isSecure,
			maxAge: result.expiresIn || 60 * 60 * 24 * 7,
		});

		if (result.refreshToken) {
			cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: isSecure,
				maxAge: 60 * 60 * 24 * 30,
			});
		}

		const parsedJwt = parseJwt(result.accessToken);
		if (parsedJwt) {
			const userProfile = {
				user_id: parsedJwt.user_id ? String(parsedJwt.user_id) : null,
				full_name: parsedJwt.full_name || parsedJwt.user_code || "User",
				email: `${parsedJwt.user_code}@parkir.local`,
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

		if (redirectTo && redirectTo.startsWith("/")) {
			redirect(302, redirectTo);
		}

		const rawRole = (parsedJwt?.role_code || "");
		console.log("[Login Success] Parsed JWT Role:", rawRole, parsedJwt);

		if (rawRole.includes("TENANT")) {
			redirect(302, "/dashboard/tenant");
		} else if (rawRole.includes("BRANCH")) {
			redirect(302, "/dashboard/branch");
		} else if (rawRole.includes("SYSTEM") || rawRole.includes("SUPER")) {
			redirect(302, "/dashboard/system");
		} else {
			redirect(302, "/dashboard/member");
		}
	},
};
