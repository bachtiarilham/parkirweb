import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type { ReportSummary } from "$lib/types/analytics/report.dto.js";

export interface ReportQueryParams {
	start_date?: string;
	end_date?: string;
	branch_id?: number | string;
	period?: "daily" | "weekly" | "monthly" | string;
}

export const reportService = {
	/**
	 * Ambil laporan ringkasan analitik dan statistik transaksi per tanggal (Protected Tenant)
	 */
	async getSummary(
		token?: string | null,
		params?: ReportQueryParams,
		options: { fetch?: typeof fetch } = {}
	): Promise<ReportSummary> {
		return apiClient<ReportSummary>(API_ENDPOINTS.ANALYTICS.SUMMARY, {
			fetch: options.fetch,
			token,
			params: params as Record<string, any>,
		});
	},
};
