import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayBranchBalance,
	CreateBranchBalanceRequest,
	UpdateBranchBalanceRequest,
} from "$lib/types/financial/branch_balances.dto.js";

export const branchBalancesService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBranchBalance[]> {
		return apiClient<PayBranchBalance[]>(
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.LIST,
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
	): Promise<PayBranchBalance> {
		return apiClient<PayBranchBalance>(
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.GET_BY_ID(id),
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
	): Promise<PayBranchBalance> {
		return apiClient<PayBranchBalance>(
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.GET_BY_BRANCH(branchId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateBranchBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBranchBalance> {
		return apiClient.post<PayBranchBalance>(
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateBranchBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBranchBalance> {
		return apiClient.put<PayBranchBalance>(
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.BRANCH_BALANCES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
