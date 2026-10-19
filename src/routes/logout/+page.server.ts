import { sessionService } from "$lib/server/services/identity/session.service";
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE,
} from "../../hooks.server.js";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const actions: Actions = {
	default: async ({ cookies, fetch }) => {
		const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);
		const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);
		if (accessToken && refreshToken) {
			await sessionService.revokeSession(accessToken, refreshToken, { fetch });
		}

		cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" });
		cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" });
		cookies.delete(USER_COOKIE, { path: "/" });
		cookies.delete("session_token", { path: "/" });
		cookies.delete("jwt_token", { path: "/" });
		cookies.delete("auth_token", { path: "/" });

		redirect(302, "/login");
	},
};
