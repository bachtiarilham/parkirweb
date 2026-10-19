import { getUserContext } from "$lib/utils/getCookies.js";
import { orderService } from "$lib/server/services/financial/order.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { PayOrder } from "$lib/types/financial/order.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await orderService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayOrder[],
		};
	} catch (error) {
		console.error("[OrdersPage] Error:", error);
		return {
			items: [] as PayOrder[],
			error: error instanceof Error ? error.message : "Gagal memuat daftar pesanan pembayaran",
		};
	}
};
