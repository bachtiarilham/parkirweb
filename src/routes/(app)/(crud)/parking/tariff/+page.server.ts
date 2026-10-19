import { getUserContext } from "$lib/utils/getCookies.js";
import { tariffService } from "$lib/server/services/parking/tariff.service.js";
import { CreateTariffSchema, UpdateTariffSchema } from "$lib/schemas/parking/tariff.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { ParkingTariff } from "$lib/types/parking/tariff.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await tariffService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as ParkingTariff[],
		};
	} catch (error) {
		console.error("[TariffsPage] Error:", error);
		return {
			items: [] as ParkingTariff[],
			error: error instanceof Error ? error.message : "Gagal memuat struktur tarif",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const tariff_code = formData.get("tariff_code")?.toString() || "";
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const vehicle_type = (formData.get("vehicle_type")?.toString() || "CAR") as any;
		const base_fare = Number(formData.get("base_fare") || 0);
		const hourly_fare = Number(formData.get("hourly_fare") || 0);
		const grace_period_minutes = Number(formData.get("grace_period_minutes") || 10);
		const is_active = formData.get("is_active") !== "false";

		const parse = CreateTariffSchema.safeParse({
			tariff_code,
			tenant_id,
			branch_id,
			vehicle_type,
			base_fare,
			hourly_fare,
			grace_period_minutes,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tariffService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat konfigurasi tarif" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tarif tidak ditemukan" });

		const base_fare = formData.has("base_fare") ? Number(formData.get("base_fare")) : undefined;
		const hourly_fare = formData.has("hourly_fare") ? Number(formData.get("hourly_fare")) : undefined;
		const grace_period_minutes = formData.has("grace_period_minutes") ? Number(formData.get("grace_period_minutes")) : undefined;
		const is_active = formData.has("is_active") ? formData.get("is_active") === "true" : undefined;

		const parse = UpdateTariffSchema.safeParse({
			base_fare,
			hourly_fare,
			grace_period_minutes,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tariffService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui tarif" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await tariffService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus tarif" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada tarif dipilih" });

		try {
			await Promise.all(ids.map((id) => tariffService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus beberapa tarif" });
		}
	},
};
