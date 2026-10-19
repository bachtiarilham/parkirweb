import { getUserContext } from "$lib/utils/getCookies.js";
import { transactionsService } from "$lib/server/services/financial/transactions.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayTransaction } from "$lib/types/financial/transactions.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await transactionsService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayTransaction[],
		};
	} catch (error) {
		console.error("[TransactionsPage] Error:", error);
		return {
			items: [] as PayTransaction[],
			error: error instanceof Error ? error.message : "Gagal memuat transaksi pembayaran",
		};
	}
};
