import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayPlatformBalance,
	CreatePlatformBalanceRequest,
	UpdatePlatformBalanceRequest,
} from "$lib/types/financial/platform_balances.dto.js";

export const platformBalancesService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayPlatformBalance[]> {
		return apiClient<PayPlatformBalance[]>(
			API_ENDPOINTS.FINANCIAL.PLATFORM_BALANCES.LIST,
			{
				fetch: options.fetch,
				token,
				params,
			}
		);
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayPlatformBalance> {
		return apiClient<PayPlatformBalance>(
			API_ENDPOINTS.FINANCIAL.PLATFORM_BALANCES.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreatePlatformBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayPlatformBalance> {
		return apiClient.post<PayPlatformBalance>(
			API_ENDPOINTS.FINANCIAL.PLATFORM_BALANCES.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdatePlatformBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayPlatformBalance> {
		return apiClient.put<PayPlatformBalance>(
			API_ENDPOINTS.FINANCIAL.PLATFORM_BALANCES.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.PLATFORM_BALANCES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
