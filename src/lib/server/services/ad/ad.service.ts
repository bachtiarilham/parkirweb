import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { Ad, PopularAd } from "$lib/types/ad/ad.dto.js";

export interface AdQueryParams {
	page?: number;
	limit?: number;
	status?: string;
	tenant_id?: string;
}

export const adService = {
	/**
	 * Ambil daftar iklan aktif (Public)
	 */
	async getActiveAds(
		params?: AdQueryParams,
		options: { fetch?: typeof fetch } = {}
	): Promise<Ad[]> {
		return apiClient<Ad[]>(API_ENDPOINTS.ADS.LIST, {
			fetch: options.fetch,
			params: params as Record<string, any>,
		});
	},

	/**
	 * Buat iklan baru (Protected Tenant)
	 */
	async create(
		data: Partial<Ad>,
		token: string,
		options: { fetch?: typeof fetch } = {}
	): Promise<Ad> {
		return apiClient.post<Ad>(API_ENDPOINTS.ADS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	/**
	 * Rekam klik iklan (Public)
	 */
	async recordClick(
		payload: { ad_id: string; user_id?: number; branch_id?: number },
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post<{ success: boolean; message?: string }>(
			API_ENDPOINTS.ADS.CLICK,
			payload,
			{ fetch: options.fetch }
		);
	},

	/**
	 * Ambil iklan terpopuler (Public)
	 */
	async getPopularAds(
		options: { fetch?: typeof fetch } = {}
	): Promise<PopularAd[]> {
		return apiClient<PopularAd[]>(API_ENDPOINTS.ADS.POPULAR, {
			fetch: options.fetch,
		});
	},
};
