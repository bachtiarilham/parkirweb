import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { DashboardData } from "$lib/types/analytics/tenant_dashboard.dto";
import type { GateDashboardData } from "$lib/types/analytics/branch_dashboard.dto";
import type { PlatformDashboardData } from "$lib/types/analytics/system_dashboard.dto";



export const dashboardService = {
	/**
	 * Ambil metrik ringkasan mobile dashboard (Protected JWT)
	 */
	async getTenantDashboard(
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<DashboardData> {
		return apiClient<DashboardData>(API_ENDPOINTS.ANALYTICS.TENANT_DASHBOARD, {
			fetch: options.fetch,
			token,
		});
	},
   async getBranchDashboard(
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<GateDashboardData> {
		return apiClient<GateDashboardData>(API_ENDPOINTS.ANALYTICS.BRANCH_DASHBOARD, {
			fetch: options.fetch,
			token,
		});
	},
   async getSystemDashboard(
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<PlatformDashboardData> {
		return apiClient<PlatformDashboardData>(API_ENDPOINTS.ANALYTICS.SYSTEM_DASHBOARD, {
			fetch: options.fetch,
			token,
		});
	},
};
