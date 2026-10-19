import { getUserContext } from "$lib/utils/getCookies.js";
import { branchBalancesService } from "$lib/server/services/financial/branch_balances.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayBranchBalance } from "$lib/types/financial/branch_balances.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await branchBalancesService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayBranchBalance[],
		};
	} catch (error) {
		console.error("[BranchBalancesPage] Error:", error);
		return {
			items: [] as PayBranchBalance[],
			error: error instanceof Error ? error.message : "Gagal memuat saldo cabang",
		};
	}
};
