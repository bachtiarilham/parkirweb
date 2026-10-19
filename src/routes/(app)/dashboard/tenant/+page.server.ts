import { error } from "@sveltejs/kit";
import { dashboardService } from "$lib/server/services/analytics/dashboard.service";
import { getUserContext } from "$lib/utils/getCookies.js";
import type { DashboardData } from "$lib/types/analytics/tenant_dashboard.dto";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies, fetch }): Promise<{ dashboard: DashboardData | null }> => {
	const user = getUserContext(cookies);
	const role = (user?.roleCode || "").toUpperCase();

	if (!role.includes("TENANT")) {
		error(403, "Khusus Admin Tenant");
	}

	try {
		const backendStats = await dashboardService.getTenantDashboard(undefined, { fetch });
		return {
			dashboard: backendStats || null,
		};
	} catch (err) {
		console.error("[TenantDashboard] Error loading dashboard:", err);
		return {
			dashboard: null,
		};
	}
};
