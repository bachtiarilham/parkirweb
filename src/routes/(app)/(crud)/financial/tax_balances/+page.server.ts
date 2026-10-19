import { getUserContext } from "$lib/utils/getCookies.js";
import { taxBalancesService } from "$lib/server/services/financial/tax_balances.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayTaxBalance } from "$lib/types/financial/tax_balances.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await taxBalancesService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayTaxBalance[],
		};
	} catch (error) {
		console.error("[TaxBalancesPage] Error:", error);
		return {
			items: [] as PayTaxBalance[],
			error: error instanceof Error ? error.message : "Gagal memuat saldo pajak",
		};
	}
};
