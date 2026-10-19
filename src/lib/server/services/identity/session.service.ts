import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { CreateSession, Token } from "$lib/types/identity/session.dto.js";

// export interface SessionResponse {
// 	tokens: Token;
// 	user?: any;
// }

export const sessionService = {
	/**
	 * Login / buat sesi baru (POST /api/v1/users/auth/login)
	 */
	async createSession(
		credentials: CreateSession,
		options: {
			fetch?: typeof fetch;
			deviceId?: string | null;
			deviceName?: string | null;
			tenantId?: string | null;
			tenantCode?: string | null;
			branchId?: string | null;
			branchCode?: string | null;
		} = {}
	): Promise<Token> {
		const res = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
			fetch: options.fetch,
			deviceId: options.deviceId,
			deviceName: options.deviceName,
			tenantId: options.tenantId,
			tenantCode: options.tenantCode,
			branchId: options.branchId,
			branchCode: options.branchCode,
		});

		console.log("[createSession Response]:", res);

		const accessToken = res?.accessToken || res?.access_token || res?.token || "";
		const refreshToken = res?.refreshToken || res?.refresh_token || undefined;
		const expiresIn = res?.expiresIn || res?.expires_in || 60 * 60 * 24;

		return {
			accessToken,
			refreshToken,
			expiresIn,
			expires_in: expiresIn,
		};
	},

	/**
	 * Refresh session via GET /api/v1/users/auth/refresh
	 * Header: Authorization: Bearer <refresh_token>
	 */
	async refreshSession(
		refreshToken: string,
		options: { fetch?: typeof fetch } = {}
	): Promise<Token> {
		const res = await apiClient.get<any>(API_ENDPOINTS.AUTH.REFRESH, {
			fetch: options.fetch,
			token: refreshToken,
		});

		const accessToken = res?.accessToken || res?.access_token || res?.token || "";
		const newRefreshToken = res?.refreshToken || res?.refresh_token || refreshToken;
		const expiresIn = res?.expiresIn || res?.expires_in || 60 * 60 * 24;

		return {
			accessToken,
			refreshToken: newRefreshToken,
			expiresIn,
			expires_in: expiresIn,
		};
	},

	/**
	 * Forgot password via POST /api/v1/users/auth/forgot-password
	 */
	async forgotPassword(
		emailOrUsername: string,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post(
			API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
			{ identity: emailOrUsername },
			{ fetch: options.fetch }
		);
	},

	/**
	 * Logout / Revoke session via POST /api/v1/users/auth/logout
	 */
	async revokeSession(
		accessToken: string,
      refreshToken:string,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post(
			API_ENDPOINTS.AUTH.LOGOUT,
			{refresh_token: refreshToken},
			{
				fetch: options.fetch,
				token: accessToken,
			}
		);
	},
};
