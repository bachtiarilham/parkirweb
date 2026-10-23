import { sessionService } from "$lib/server/services/identity/session.service";
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE,
} from "../../../hooks.server.js";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

async function doLogout(cookies: import("@sveltejs/kit").Cookies, customFetch: typeof fetch) {
	const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);
	const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);
	if (accessToken && refreshToken) {
		try {
			await sessionService.revokeSession(accessToken, refreshToken, { fetch: customFetch });
		} catch (e) {
			console.warn("[Logout] Revoke session warning:", e);
		}
	}

	cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" });
	cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" });
	cookies.delete(USER_COOKIE, { path: "/" });
	cookies.delete("session_token", { path: "/" });
	cookies.delete("jwt_token", { path: "/" });
	cookies.delete("auth_token", { path: "/" });

	redirect(302, "/login");
}

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	await doLogout(cookies, fetch);
};

export const actions: Actions = {
	default: async ({ cookies, fetch }) => {
		await doLogout(cookies, fetch);
	},
};
