import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { CreateSession, Token, PreAuthResult, AccessibleScope } from "$lib/types/identity/session.dto.js";

export const sessionService = {
	/**
	 * Login tahap 1 / verifikasi identitas (POST /api/v1/users/auth/login)
	 * Mengembalikan Pre-Auth Token beserta daftar hak akses cabang (accessible_scopes)
	 */
	async createSession(
		credentials: CreateSession,
		options: {
			fetch?: typeof fetch;
			deviceId?: string | null;
			deviceName?: string | null;
		} = {}
	): Promise<PreAuthResult> {
		const res = await apiClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
			fetch: options.fetch,
			deviceId: options.deviceId,
			deviceName: options.deviceName,
		});

		const preAuthToken = res?.pre_auth_token || res?.preAuthToken || "";
		const accessibleScopes: AccessibleScope[] = res?.accessible_scopes || res?.accessibleScopes || [];

		return {
			pre_auth_token: preAuthToken,
			accessible_scopes: accessibleScopes,
		};
	},

	/**
	 * Login tahap 2 / menukar Pre-Auth Token dengan Scoped Access Token (POST /api/v1/users/auth/select-scope)
	 */
	async selectScope(
		payload: { preAuthToken: string; scopeId: number },
		options: {
			fetch?: typeof fetch;
			deviceId?: string | null;
			deviceName?: string | null;
		} = {}
	): Promise<Token> {
		const res = await apiClient.post<any>(
			API_ENDPOINTS.AUTH.SELECT_SCOPE,
			{
				pre_auth_token: payload.preAuthToken,
				scope_id: payload.scopeId,
			},
			{
				fetch: options.fetch,
				deviceId: options.deviceId,
				deviceName: options.deviceName,
			}
		);

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
	 * Berganti cabang / context switching saat sudah login (POST /api/v1/users/auth/switch-scope)
	 */
	async switchScope(
		scopeId: number,
		options: {
			fetch?: typeof fetch;
			deviceId?: string | null;
			deviceName?: string | null;
		} = {}
	): Promise<Token> {
		const res = await apiClient.post<any>(
			API_ENDPOINTS.AUTH.SWITCH_SCOPE,
			{ scope_id: scopeId },
			{
				fetch: options.fetch,
				deviceId: options.deviceId,
				deviceName: options.deviceName,
			}
		);

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
	 * Mengambil daftar ruang kerja yang dapat diakses pengguna (GET /api/v1/users/auth/scopes)
	 */
	async getScopes(options: { fetch?: typeof fetch } = {}): Promise<AccessibleScope[]> {
		const res = await apiClient.get<any>(API_ENDPOINTS.AUTH.SCOPES, {
			fetch: options.fetch,
		});
		return Array.isArray(res) ? res : res?.accessible_scopes || [];
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
		refreshToken: string,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post(
			API_ENDPOINTS.AUTH.LOGOUT,
			{ refresh_token: refreshToken },
			{
				fetch: options.fetch,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
	},
};
