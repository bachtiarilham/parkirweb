import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayBankReconciliation,
	CreateBankReconciliationRequest,
	UpdateBankReconciliationRequest,
} from "$lib/types/financial/bank_reconciliation.dto.js";

export const bankReconciliationService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBankReconciliation[]> {
		return apiClient<PayBankReconciliation[]>(
			API_ENDPOINTS.FINANCIAL.BANK_RECONCILIATIONS.LIST,
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
	): Promise<PayBankReconciliation> {
		return apiClient<PayBankReconciliation>(
			API_ENDPOINTS.FINANCIAL.BANK_RECONCILIATIONS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateBankReconciliationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBankReconciliation> {
		return apiClient.post<PayBankReconciliation>(
			API_ENDPOINTS.FINANCIAL.BANK_RECONCILIATIONS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateBankReconciliationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayBankReconciliation> {
		return apiClient.put<PayBankReconciliation>(
			API_ENDPOINTS.FINANCIAL.BANK_RECONCILIATIONS.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.BANK_RECONCILIATIONS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
