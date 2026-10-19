import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayTenantBalance,
	CreateTenantBalanceRequest,
	UpdateTenantBalanceRequest,
} from "$lib/types/financial/tenant_balances.dto.js";

export const tenantBalancesService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTenantBalance[]> {
		return apiClient<PayTenantBalance[]>(
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.LIST,
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
	): Promise<PayTenantBalance> {
		return apiClient<PayTenantBalance>(
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async getByTenantId(
		tenantId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTenantBalance> {
		return apiClient<PayTenantBalance>(
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.GET_BY_TENANT(tenantId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTenantBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTenantBalance> {
		return apiClient.post<PayTenantBalance>(
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTenantBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTenantBalance> {
		return apiClient.put<PayTenantBalance>(
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.TENANT_BALANCES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
