import { error } from "@sveltejs/kit";
import { dashboardService } from "$lib/server/services/analytics/dashboard.service";
import { getUserContext } from "$lib/utils/getCookies.js";
import type { PlatformDashboardData } from "$lib/types/analytics/system_dashboard.dto";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies, fetch }): Promise<{ dashboard: PlatformDashboardData | null }> => {
	const user = getUserContext(cookies);
	const role = (user?.roleCode || "").toUpperCase();

	if (!role.includes("SYSTEM") && !role.includes("SUPER")) {
		error(403, "Khusus Super Admin / System");
	}

	try {
		const backendStats = await dashboardService.getSystemDashboard(undefined, { fetch });
		return {
			dashboard: backendStats || null,
		};
	} catch (err) {
		console.error("[SystemDashboard] Error loading dashboard:", err);
		return {
			dashboard: null,
		};
	}
};
