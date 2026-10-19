import { getUserContext } from "$lib/utils/getCookies.js";
import { promoService } from "$lib/server/services/parking/promo.service.js";
import { CreatePromoSchema, UpdatePromoSchema } from "$lib/schemas/parking/promo.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Promo } from "$lib/types/parking/promo.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await promoService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Promo[],
		};
	} catch (error) {
		console.error("[PromosPage] Error:", error);
		return {
			items: [] as Promo[],
			error: error instanceof Error ? error.message : "Gagal memuat promo voucher",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const code = formData.get("code")?.toString() || "";
		const description = formData.get("description")?.toString() || undefined;
		const discount_type = (formData.get("discount_type")?.toString() || "PERCENT") as any;
		const discount_value = Number(formData.get("discount_value") || 0);
		const max_discount = formData.get("max_discount") ? Number(formData.get("max_discount")) : undefined;
		const min_purchase = formData.get("min_purchase") ? Number(formData.get("min_purchase")) : undefined;
		const start_date = formData.get("start_date")?.toString() || "";
		const end_date = formData.get("end_date")?.toString() || "";
		const usage_limit = Number(formData.get("usage_limit") || 100);

		const parse = CreatePromoSchema.safeParse({
			tenant_id,
			branch_id,
			code,
			description,
			discount_type,
			discount_value,
			max_discount,
			min_purchase,
			start_date,
			end_date,
			usage_limit,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await promoService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat voucher promo" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID promo tidak ditemukan" });

		const description = formData.get("description")?.toString() || undefined;
		const discount_value = formData.has("discount_value") ? Number(formData.get("discount_value")) : undefined;
		const usage_limit = formData.has("usage_limit") ? Number(formData.get("usage_limit")) : undefined;
		const end_date = formData.get("end_date")?.toString() || undefined;

		const parse = UpdatePromoSchema.safeParse({
			description,
			discount_value,
			usage_limit,
			end_date,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await promoService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui promo" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await promoService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus promo" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada promo dipilih" });

		try {
			await Promise.all(ids.map((id) => promoService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus beberapa promo" });
		}
	},
};
