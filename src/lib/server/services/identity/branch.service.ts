import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	Branch,
	CreateBranchRequest,
	UpdateBranchRequest,
} from "$lib/types/identity/branch.dto.js";

export const branchService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<Branch[]> {
		return apiClient<Branch[]>(API_ENDPOINTS.BRANCHES.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Branch> {
		return apiClient<Branch>(API_ENDPOINTS.BRANCHES.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	async create(
		data: CreateBranchRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Branch> {
		return apiClient.post<Branch>(API_ENDPOINTS.BRANCHES.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	async update(
		id: string | number,
		data: UpdateBranchRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Branch> {
		return apiClient.patch<Branch>(API_ENDPOINTS.BRANCHES.UPDATE(id), data, {
			fetch: options.fetch,
			token,
		});
	},

	async delete(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.BRANCHES.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
