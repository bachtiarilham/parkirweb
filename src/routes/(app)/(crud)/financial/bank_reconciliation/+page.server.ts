import { getUserContext } from "$lib/utils/getCookies.js";
import { bankReconciliationService } from "$lib/server/services/financial/bank_reconciliation.service.js";
import { CreateBankReconciliationSchema, UpdateBankReconciliationSchema } from "$lib/schemas/financial/bank_reconciliation.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { PayBankReconciliation } from "$lib/types/financial/bank_reconciliation.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await bankReconciliationService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as PayBankReconciliation[],
		};
	} catch (error) {
		console.error("[BankReconPage] Error:", error);
		return {
			items: [] as PayBankReconciliation[],
			error: error instanceof Error ? error.message : "Gagal memuat rekonsiliasi bank",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const payment_order_code = formData.get("payment_order_code")?.toString() || "";
		const psp_reference_id = formData.get("psp_reference_id")?.toString() || undefined;
		const internal_amount = Number(formData.get("internal_amount") || 0);
		const external_amount = Number(formData.get("external_amount") || internal_amount);
		const status = formData.get("status")?.toString() || "MATCHED";
		const notes = formData.get("notes")?.toString() || undefined;

		const parse = CreateBankReconciliationSchema.safeParse({
			payment_order_code,
			psp_reference_id,
			internal_amount,
			external_amount,
			status,
			notes,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await bankReconciliationService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat rekonsiliasi bank" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID rekonsiliasi tidak ditemukan" });

		const payment_order_code = formData.get("payment_order_code")?.toString() || undefined;
		const psp_reference_id = formData.get("psp_reference_id")?.toString() || undefined;
		const internal_amount = formData.has("internal_amount") ? Number(formData.get("internal_amount")) : undefined;
		const external_amount = formData.has("external_amount") ? Number(formData.get("external_amount")) : undefined;
		const status = formData.get("status")?.toString() || undefined;
		const notes = formData.get("notes")?.toString() || undefined;

		const parse = UpdateBankReconciliationSchema.safeParse({
			payment_order_code,
			psp_reference_id,
			internal_amount,
			external_amount,
			status,
			notes,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await bankReconciliationService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui rekonsiliasi" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await bankReconciliationService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus rekonsiliasi" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada data yang dipilih" });

		try {
			await Promise.all(ids.map((id) => bankReconciliationService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus beberapa data" });
		}
	},
};
