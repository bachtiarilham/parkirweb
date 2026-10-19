import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayCashierReconciliation,
	CreateCashierReconciliationRequest,
	UpdateCashierReconciliationRequest,
} from "$lib/types/financial/cashier_reconciliation.dto.js";

export const cashierReconciliationService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayCashierReconciliation[]> {
		return apiClient<PayCashierReconciliation[]>(
			API_ENDPOINTS.FINANCIAL.CASHIER_RECONCILIATIONS.LIST,
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
	): Promise<PayCashierReconciliation> {
		return apiClient<PayCashierReconciliation>(
			API_ENDPOINTS.FINANCIAL.CASHIER_RECONCILIATIONS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateCashierReconciliationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayCashierReconciliation> {
		return apiClient.post<PayCashierReconciliation>(
			API_ENDPOINTS.FINANCIAL.CASHIER_RECONCILIATIONS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateCashierReconciliationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayCashierReconciliation> {
		return apiClient.put<PayCashierReconciliation>(
			API_ENDPOINTS.FINANCIAL.CASHIER_RECONCILIATIONS.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.CASHIER_RECONCILIATIONS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
