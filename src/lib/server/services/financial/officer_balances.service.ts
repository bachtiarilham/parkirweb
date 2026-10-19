import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	PayOfficerBalance,
	CreateOfficerBalanceRequest,
	UpdateOfficerBalanceRequest,
} from "$lib/types/financial/officer_balances.dto.js";

export const officerBalancesService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOfficerBalance[]> {
		return apiClient<PayOfficerBalance[]>(
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.LIST,
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
	): Promise<PayOfficerBalance> {
		return apiClient<PayOfficerBalance>(
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async getByOfficerId(
		officerUserId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOfficerBalance> {
		return apiClient<PayOfficerBalance>(
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.GET_BY_OFFICER(officerUserId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateOfficerBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOfficerBalance> {
		return apiClient.post<PayOfficerBalance>(
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateOfficerBalanceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PayOfficerBalance> {
		return apiClient.put<PayOfficerBalance>(
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.UPDATE(id),
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
			API_ENDPOINTS.FINANCIAL.OFFICER_BALANCES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
