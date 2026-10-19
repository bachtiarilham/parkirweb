import { getUserContext } from "$lib/utils/getCookies.js";
import { platformBalancesService } from "$lib/server/services/financial/platform_balances.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayPlatformBalance } from "$lib/types/financial/platform_balances.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await platformBalancesService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayPlatformBalance[],
		};
	} catch (error) {
		console.error("[PlatformBalancesPage] Error:", error);
		return {
			items: [] as PayPlatformBalance[],
			error: error instanceof Error ? error.message : "Gagal memuat saldo sistem platform",
		};
	}
};
