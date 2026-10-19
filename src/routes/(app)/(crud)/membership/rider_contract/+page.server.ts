import { getUserContext } from "$lib/utils/getCookies.js";
import { riderContractService } from "$lib/server/services/membership/rider_contract.service.js";
import { CreateRiderContractSchema, UpdateRiderContractSchema } from "$lib/schemas/membership/rider_contract.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { MemberRiderContract } from "$lib/types/membership/rider_contract.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await riderContractService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as MemberRiderContract[],
		};
	} catch (error) {
		console.error("[RiderContractPage] Error:", error);
		return {
			items: [] as MemberRiderContract[],
			error: error instanceof Error ? error.message : "Gagal memuat langganan member",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const plan_id = Number(formData.get("plan_id") || 0);
		const user_id = formData.get("user_id") ? Number(formData.get("user_id")) : undefined;
		const rfid_card_no = formData.get("rfid_card_no")?.toString() || "";
		const license_plates = formData.get("license_plates")?.toString() || "";
		const status = formData.get("status")?.toString() || "ACTIVE";
		const expires_at = formData.get("expires_at")?.toString() || undefined;

		const parse = CreateRiderContractSchema.safeParse({
			plan_id,
			user_id,
			rfid_card_no,
			license_plates,
			status,
			expires_at,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await riderContractService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat kontrak member" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID member tidak ditemukan" });

		const plan_id = formData.has("plan_id") ? Number(formData.get("plan_id")) : undefined;
		const rfid_card_no = formData.get("rfid_card_no")?.toString() || undefined;
		const license_plates = formData.get("license_plates")?.toString() || undefined;
		const status = formData.get("status")?.toString() || undefined;
		const expires_at = formData.get("expires_at")?.toString() || undefined;

		const parse = UpdateRiderContractSchema.safeParse({
			plan_id,
			rfid_card_no,
			license_plates,
			status,
			expires_at,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await riderContractService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui kontrak member" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await riderContractService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus kontrak member" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada member dipilih" });

		try {
			await Promise.all(ids.map((id) => riderContractService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus kontrak member terpilih" });
		}
	},
};
