import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayTransaction,
	CreateTransactionRequest,
	UpdateTransactionRequest,
} from "$lib/types/financial/transactions.dto.js";

export const transactionsService = {
	async getAll(
		tokenOrParams?: string | null | Record<string, any>,
		paramsOrOptions?: Record<string, any> | { fetch?: typeof fetch; token?: string | null },
		options: { fetch?: typeof fetch; token?: string | null } = {}
	): Promise<PayTransaction[]> {
		let token: string | null | undefined = undefined;
		let params: Record<string, any> | undefined = undefined;
		let fetchFn: typeof fetch | undefined = undefined;

		if (typeof tokenOrParams === "string" || tokenOrParams === null) {
			token = tokenOrParams;
			if (paramsOrOptions && ("fetch" in paramsOrOptions || "token" in paramsOrOptions)) {
				fetchFn = (paramsOrOptions as any).fetch;
				token = (paramsOrOptions as any).token ?? token;
			} else {
				params = paramsOrOptions as Record<string, any> | undefined;
				fetchFn = options.fetch;
				token = options.token ?? token;
			}
		} else if (typeof tokenOrParams === "object" && tokenOrParams !== null) {
			// Deteksi apakah argumen pertama adalah options { fetch, token }
			if ("fetch" in tokenOrParams && typeof (tokenOrParams as any).fetch === "function") {
				fetchFn = (tokenOrParams as any).fetch;
				token = (tokenOrParams as any).token;
				params = paramsOrOptions as Record<string, any> | undefined;
			} else {
				params = tokenOrParams;
				const opts = paramsOrOptions as { fetch?: typeof fetch; token?: string | null } | undefined;
				fetchFn = opts?.fetch;
				token = opts?.token;
			}
		} else {
			fetchFn = options.fetch;
		}

		if (params && "fetch" in params) {
			const { fetch: _, ...rest } = params as any;
			params = rest;
		}

		return apiClient<PayTransaction[]>(
			API_ENDPOINTS.FINANCIAL.PAY_TRANSACTIONS.LIST,
			{
				fetch: fetchFn,
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
