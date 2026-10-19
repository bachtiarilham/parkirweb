import { getUserContext } from "$lib/utils/getCookies.js";
import { officerBalancesService } from "$lib/server/services/financial/officer_balances.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayOfficerBalance } from "$lib/types/financial/officer_balances.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await officerBalancesService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayOfficerBalance[],
		};
	} catch (error) {
		console.error("[OfficerBalancesPage] Error:", error);
		return {
			items: [] as PayOfficerBalance[],
			error: error instanceof Error ? error.message : "Gagal memuat saldo petugas",
		};
	}
};
