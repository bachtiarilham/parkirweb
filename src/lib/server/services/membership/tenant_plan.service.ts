import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	MemberTenantPlan,
	CreateTenantPlanRequest,
	UpdateTenantPlanRequest,
} from "$lib/types/membership/tenant_plan.dto.js";

export const tenantPlanService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantPlan[]> {
		return apiClient<MemberTenantPlan[]>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_PLANS.LIST,
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
	): Promise<MemberTenantPlan> {
		return apiClient<MemberTenantPlan>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_PLANS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTenantPlanRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantPlan> {
		return apiClient.post<MemberTenantPlan>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_PLANS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTenantPlanRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberTenantPlan> {
		return apiClient.put<MemberTenantPlan>(
			API_ENDPOINTS.MEMBERSHIP.TENANT_PLANS.UPDATE(id),
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
			API_ENDPOINTS.MEMBERSHIP.TENANT_PLANS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
