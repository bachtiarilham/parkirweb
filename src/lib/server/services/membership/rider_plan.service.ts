import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	MemberRiderPlan,
	CreateRiderPlanRequest,
	UpdateRiderPlanRequest,
} from "$lib/types/membership/rider_plan.dto.js";

export const riderPlanService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderPlan[]> {
		return apiClient<MemberRiderPlan[]>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_PLANS.LIST,
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
	): Promise<MemberRiderPlan> {
		return apiClient<MemberRiderPlan>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_PLANS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateRiderPlanRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderPlan> {
		return apiClient.post<MemberRiderPlan>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_PLANS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateRiderPlanRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderPlan> {
		return apiClient.put<MemberRiderPlan>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_PLANS.UPDATE(id),
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
			API_ENDPOINTS.MEMBERSHIP.RIDER_PLANS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
