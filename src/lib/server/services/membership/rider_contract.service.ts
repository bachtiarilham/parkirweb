import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	MemberRiderContract,
	CreateRiderContractRequest,
	UpdateRiderContractRequest,
} from "$lib/types/membership/rider_contract.dto.js";

export const riderContractService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderContract[]> {
		return apiClient<MemberRiderContract[]>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.LIST,
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
	): Promise<MemberRiderContract> {
		return apiClient<MemberRiderContract>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateRiderContractRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderContract> {
		return apiClient.post<MemberRiderContract>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateRiderContractRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberRiderContract> {
		return apiClient.put<MemberRiderContract>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.UPDATE(id),
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
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async renewSubscription(
		data: import("$lib/types/analytics/member_dashboard.dto.js").RenewSubscriptionRequestDto,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<import("$lib/types/analytics/member_dashboard.dto.js").RenewSubscriptionResponseDto> {
		return apiClient.post<import("$lib/types/analytics/member_dashboard.dto.js").RenewSubscriptionResponseDto>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.RENEW,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
