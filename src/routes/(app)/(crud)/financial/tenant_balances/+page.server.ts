import { getUserContext } from "$lib/utils/getCookies.js";
import { tenantBalancesService } from "$lib/server/services/financial/tenant_balances.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayTenantBalance } from "$lib/types/financial/tenant_balances.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await tenantBalancesService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayTenantBalance[],
		};
	} catch (error) {
		console.error("[TenantBalancesPage] Error:", error);
		return {
			items: [] as PayTenantBalance[],
			error: error instanceof Error ? error.message : "Gagal memuat saldo tenant",
		};
	}
};
