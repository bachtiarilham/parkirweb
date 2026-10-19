import { getUserContext } from "$lib/utils/getCookies.js";
import { cashierReconciliationService } from "$lib/server/services/financial/cashier_reconciliation.service.js";
import { CreateCashierReconciliationSchema, UpdateCashierReconciliationSchema } from "$lib/schemas/financial/cashier_reconciliation.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { PayCashierReconciliation } from "$lib/types/financial/cashier_reconciliation.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await cashierReconciliationService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayCashierReconciliation[],
		};
	} catch (error) {
		console.error("[CashierReconPage] Error:", error);
		return {
			items: [] as PayCashierReconciliation[],
			error: error instanceof Error ? error.message : "Gagal memuat rekonsiliasi kasir",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const code = formData.get("code")?.toString() || undefined;
		const shift_id = Number(formData.get("shift_id") || 0);
		const officer_user_id = Number(formData.get("officer_user_id") || 0);
		const expected_cash_revenue = Number(formData.get("expected_cash_revenue") || 0);
		const actual_cash_reported = Number(formData.get("actual_cash_reported") || 0);
		const status = formData.get("status")?.toString() || "PENDING";

		const parse = CreateCashierReconciliationSchema.safeParse({
			code,
			shift_id,
			officer_user_id,
			expected_cash_revenue,
			actual_cash_reported,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await cashierReconciliationService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat rekonsiliasi kasir" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID rekonsiliasi tidak ditemukan" });

		const code = formData.get("code")?.toString() || undefined;
		const shift_id = formData.has("shift_id") ? Number(formData.get("shift_id")) : undefined;
		const officer_user_id = formData.has("officer_user_id") ? Number(formData.get("officer_user_id")) : undefined;
		const expected_cash_revenue = formData.has("expected_cash_revenue") ? Number(formData.get("expected_cash_revenue")) : undefined;
		const actual_cash_reported = formData.has("actual_cash_reported") ? Number(formData.get("actual_cash_reported")) : undefined;
		const status = formData.get("status")?.toString() || undefined;

		const parse = UpdateCashierReconciliationSchema.safeParse({
			code,
			shift_id,
			officer_user_id,
			expected_cash_revenue,
			actual_cash_reported,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await cashierReconciliationService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui rekonsiliasi kasir" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await cashierReconciliationService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus rekonsiliasi kasir" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada data yang dipilih" });

		try {
			await Promise.all(ids.map((id) => cashierReconciliationService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus data" });
		}
	},
};
