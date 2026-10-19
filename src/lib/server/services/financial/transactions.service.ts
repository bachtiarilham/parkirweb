import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayTransaction,
	CreateTransactionRequest,
	UpdateTransactionRequest,
} from "$lib/types/financial/transactions.dto.js";

export const transactionsService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTransaction[]> {
		return apiClient<PayTransaction[]>(
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.LIST,
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
	): Promise<PayTransaction> {
		return apiClient<PayTransaction>(
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTransactionRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTransaction> {
		return apiClient.post<PayTransaction>(
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTransactionRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayTransaction> {
		return apiClient.put<PayTransaction>(
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
