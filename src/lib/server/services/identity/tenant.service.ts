import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	Tenant,
	CreateTenantRequest,
	UpdateTenantRequest,
} from "$lib/types/identity/tenant.dto.js";

export const tenantService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<Tenant[]> {
		return apiClient<Tenant[]>(API_ENDPOINTS.TENANTS.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Tenant> {
		return apiClient<Tenant>(API_ENDPOINTS.TENANTS.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	async create(
		data: CreateTenantRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Tenant> {
		return apiClient.post<Tenant>(API_ENDPOINTS.TENANTS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	async update(
		id: string | number,
		data: UpdateTenantRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Tenant> {
		return apiClient.patch<Tenant>(API_ENDPOINTS.TENANTS.UPDATE(id), data, {
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
			API_ENDPOINTS.TENANTS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
