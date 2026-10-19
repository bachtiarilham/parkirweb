import { getUserContext } from "$lib/utils/getCookies.js";
import { inventoryService } from "$lib/server/services/parking/inventory.service.js";
import { CreateSlotsInventorySchema, UpdateSlotsInventorySchema } from "$lib/schemas/parking/inventory.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { ParkSlotsInventory } from "$lib/types/parking/inventory.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await inventoryService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as ParkSlotsInventory[],
		};
	} catch (error) {
		console.error("[InventoryPage] Error:", error);
		return {
			items: [] as ParkSlotsInventory[],
			error: error instanceof Error ? error.message : "Gagal memuat inventaris slot",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const vehicle_type = formData.get("vehicle_type")?.toString() || "MOBIL";
		const date = formData.get("date")?.toString() || new Date().toISOString().split("T")[0];
		const total_slots = Number(formData.get("total_slots") || 0);
		const total_reserved = Number(formData.get("total_reserved") || 0);

		const parse = CreateSlotsInventorySchema.safeParse({
			branch_id,
			vehicle_type,
			date,
			total_slots,
			total_reserved,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await inventoryService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat alokasi slot" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID slot tidak ditemukan" });

		const vehicle_type = formData.get("vehicle_type")?.toString() || undefined;
		const total_slots = formData.has("total_slots") ? Number(formData.get("total_slots")) : undefined;
		const total_reserved = formData.has("total_reserved") ? Number(formData.get("total_reserved")) : undefined;

		const parse = UpdateSlotsInventorySchema.safeParse({
			vehicle_type,
			total_slots,
			total_reserved,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await inventoryService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui alokasi slot" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await inventoryService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus slot" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada slot dipilih" });

		try {
			await Promise.all(ids.map((id) => inventoryService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus data slot" });
		}
	},
};
