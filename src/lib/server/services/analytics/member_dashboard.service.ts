import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { MemberDashboard } from "$lib/types/analytics/member_dashboard.dto.js";

export const memberDashboardService = {
	async getDashboard(
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<MemberDashboard> {
		return apiClient<MemberDashboard>(
			API_ENDPOINTS.ANALYTICS.MEMBER_DASHBOARD,
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
