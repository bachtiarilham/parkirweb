import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayTaxBalance,
	CreateTaxBalanceRequest,
	UpdateTaxBalanceRequest,
} from "$lib/types/financial/tax_balances.dto.js";

export const taxBalancesService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTaxBalance[]> {
		return apiClient<PayTaxBalance[]>(
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.LIST,
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
	): Promise<PayTaxBalance> {
		return apiClient<PayTaxBalance>(
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async getByBranchId(
		branchId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTaxBalance> {
		return apiClient<PayTaxBalance>(
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.GET_BY_BRANCH(branchId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTaxBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTaxBalance> {
		return apiClient.post<PayTaxBalance>(
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTaxBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTaxBalance> {
		return apiClient.put<PayTaxBalance>(
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.TAX_BALANCES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
