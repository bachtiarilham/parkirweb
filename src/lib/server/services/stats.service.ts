import { apiClient, API_ENDPOINTS } from "../api/index.js";

export interface DashboardStats {
	totalUsers: number;
	activeSessions: number;
	totalPages: number;
	unreadNotifications: number;
}

export interface DashboardData {
	stats: DashboardStats;
	trends: { users: number; pages: number };
	roleDistribution: Array<{ role: string; count: number }>;
	monthlySignups: Array<{ month: string; count: number }>;
	recentActivity: Array<{ label: string; description: string; time: string }>;
	recentNotifications: Array<{
		id: string;
		title: string;
		message: string;
		type: string;
		read: boolean;
		createdAt: Date | string;
	}>;
	quickStats: { publishedPages: number; activeEditors: number };
	pagesByStatus: Array<{ status: string; count: number }>;
	contentTrend: Array<{ month: string; status: string; count: number }>;
	systemStatus: { maintenanceMode: boolean };
}

export const statsService = {
	/**
	 * Ambil ringkasan statistik dashboard dari backend eksternal
	 */
	async getDashboardStats(
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<DashboardData | null> {
		try {
			return await apiClient<DashboardData>(API_ENDPOINTS.ANALYTICS.SUMMARY, {
				fetch: options.fetch,
				token,
			});
		} catch (error) {
			console.warn("[StatsService] Gagal memuat statistik dari backend:", error);
			return null;
		}
	},
};
