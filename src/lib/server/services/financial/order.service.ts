import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayOrder,
	CreateOrderRequest,
	UpdateOrderRequest,
} from "$lib/types/financial/order.dto.js";

export const orderService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOrder[]> {
		return apiClient<PayOrder[]>(API_ENDPOINTS.FINANCIAL.ORDERS.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOrder> {
		return apiClient<PayOrder>(API_ENDPOINTS.FINANCIAL.ORDERS.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	async create(
		data: CreateOrderRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOrder> {
		return apiClient.post<PayOrder>(API_ENDPOINTS.FINANCIAL.ORDERS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	async update(
		id: string | number,
		data: UpdateOrderRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOrder> {
		return apiClient.put<PayOrder>(
			API_ENDPOINTS.FINANCIAL.ORDERS.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.ORDERS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
