import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	Promo,
	CreatePromoRequest,
	UpdatePromoRequest,
} from "$lib/types/parking/promo.dto.js";

export const promoService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<Promo[]> {
		return apiClient<Promo[]>(API_ENDPOINTS.PARKING.PROMOS.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Promo> {
		return apiClient<Promo>(API_ENDPOINTS.PARKING.PROMOS.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	async create(
		data: CreatePromoRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Promo> {
		return apiClient.post<Promo>(API_ENDPOINTS.PARKING.PROMOS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	async update(
		id: string | number,
		data: UpdatePromoRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Promo> {
		return apiClient.put<Promo>(
			API_ENDPOINTS.PARKING.PROMOS.UPDATE(id),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async delete(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.PARKING.PROMOS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
