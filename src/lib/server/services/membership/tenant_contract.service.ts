import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	MemberTenantContract,
	CreateTenantContractRequest,
	UpdateTenantContractRequest,
} from "$lib/types/membership/tenant_contract.dto.js";

export const tenantContractService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantContract[]> {
		return apiClient<MemberTenantContract[]>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_CONTRACTS.LIST,
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
	): Promise<MemberTenantContract> {
		return apiClient<MemberTenantContract>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_CONTRACTS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTenantContractRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantContract> {
		return apiClient.post<MemberTenantContract>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_CONTRACTS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTenantContractRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantContract> {
		return apiClient.put<MemberTenantContract>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_CONTRACTS.UPDATE(id),
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
			API_ENDPOINTS.MEMBERSHIP.TENANT_CONTRACTS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
