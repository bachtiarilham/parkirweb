import { getUserContext } from "$lib/utils/getCookies.js";
import { shiftService } from "$lib/server/services/parking/shift.service.js";
import { CreateShiftSchema, UpdateShiftSchema } from "$lib/schemas/parking/shift.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Shift } from "$lib/types/parking/shift.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const user = getUserContext(cookies);
	
	try {
		const items = await shiftService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Shift[],
		};
	} catch (error) {
		console.error("[ShiftsPage] Error:", error);
		return {
			items: [] as Shift[],
			error: error instanceof Error ? error.message : "Gagal memuat shift kerja",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const user_id = Number(formData.get("user_id") || String(user?.userId ?? "") || 1);
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const cash_float_start = Number(formData.get("cash_float_start") || 0);
		const status = (formData.get("status")?.toString() || "OPEN") as any;

		const parse = CreateShiftSchema.safeParse({
			user_id,
			branch_id,
			cash_float_start,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await shiftService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuka shift" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID shift tidak ditemukan" });

		const cash_collected = formData.has("cash_collected") ? Number(formData.get("cash_collected")) : undefined;
		const status = (formData.get("status")?.toString() || undefined) as any;
		const end_time = formData.get("end_time")?.toString() || new Date().toISOString();

		const parse = UpdateShiftSchema.safeParse({
			cash_collected,
			status,
			end_time,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await shiftService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menutup shift" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await shiftService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus shift" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada shift dipilih" });

		try {
			await Promise.all(ids.map((id) => shiftService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus beberapa shift" });
		}
	},
};
