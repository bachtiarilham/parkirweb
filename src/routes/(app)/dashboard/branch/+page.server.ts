import { error } from "@sveltejs/kit";
import { dashboardService } from "$lib/server/services/analytics/dashboard.service";
import { getUserContext } from "$lib/utils/getCookies.js";
import type { GateDashboardData } from "$lib/types/analytics/branch_dashboard.dto";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies, fetch }): Promise<{ dashboard: GateDashboardData | null }> => {
	const user = getUserContext(cookies);
	const role = (user?.roleCode || "").toUpperCase();

	if (!role.includes("BRANCH")) {
		error(403, "Khusus Admin Branch");
	}

	try {
		const backendStats = await dashboardService.getBranchDashboard(undefined, { fetch });
		return {
			dashboard: backendStats || null,
		};
	} catch (err) {
		console.error("[BranchDashboard] Error loading dashboard:", err);
		return {
			dashboard: null,
		};
	}
};
