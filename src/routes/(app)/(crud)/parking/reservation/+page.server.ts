import { getUserContext } from "$lib/utils/getCookies.js";
import { reservationService } from "$lib/server/services/parking/reservation.service.js";
import { CreateReservationSchema, UpdateReservationSchema } from "$lib/schemas/parking/reservation.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { ParkReservation } from "$lib/types/parking/reservation.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const user = getUserContext(cookies);
	
	try {
		const items = await reservationService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as ParkReservation[],
		};
	} catch (error) {
		console.error("[ReservationsPage] Error:", error);
		return {
			items: [] as ParkReservation[],
			error: error instanceof Error ? error.message : "Gagal memuat reservasi",
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
		const vehicle_type = (formData.get("vehicle_type")?.toString() || "CAR") as any;
		const start_date = formData.get("start_date")?.toString() || "";
		const end_date = formData.get("end_date")?.toString() || "";
		const status = (formData.get("status")?.toString() || "PENDING") as any;

		const parse = CreateReservationSchema.safeParse({
			user_id,
			branch_id,
			vehicle_type,
			start_date,
			end_date,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await reservationService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat reservasi" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID reservasi tidak ditemukan" });

		const vehicle_type = (formData.get("vehicle_type")?.toString() || undefined) as any;
		const start_date = formData.get("start_date")?.toString() || undefined;
		const end_date = formData.get("end_date")?.toString() || undefined;
		const status = (formData.get("status")?.toString() || undefined) as any;

		const parse = UpdateReservationSchema.safeParse({
			vehicle_type,
			start_date,
			end_date,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await reservationService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui reservasi" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await reservationService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus reservasi" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada reservasi dipilih" });

		try {
			await Promise.all(ids.map((id) => reservationService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus data reservasi" });
		}
	},
};
