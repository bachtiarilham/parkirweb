import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	Gate,
	CreateGateRequest,
	UpdateGateRequest,
} from "$lib/types/identity/gate.dto.js";

export const gateService = {
	async getAllByBranch(
		branchId: string | number,
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<Gate[]> {
		return apiClient<Gate[]>(API_ENDPOINTS.BRANCHES.GATES.LIST(branchId), {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		branchId: string | number,
		deviceId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Gate> {
		return apiClient<Gate>(
			API_ENDPOINTS.BRANCHES.GATES.GET_BY_ID(branchId, deviceId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		branchId: string | number,
		data: CreateGateRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Gate> {
		return apiClient.post<Gate>(
			API_ENDPOINTS.BRANCHES.GATES.CREATE(branchId),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		branchId: string | number,
		deviceId: string | number,
		data: UpdateGateRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Gate> {
		return apiClient.patch<Gate>(
			API_ENDPOINTS.BRANCHES.GATES.UPDATE(branchId, deviceId),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async delete(
		branchId: string | number,
		deviceId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.BRANCHES.GATES.DELETE(branchId, deviceId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
