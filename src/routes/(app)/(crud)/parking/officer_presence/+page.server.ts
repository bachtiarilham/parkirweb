import { getUserContext } from "$lib/utils/getCookies.js";
import { officerPresenceService } from "$lib/server/services/parking/officer_presence.service.js";
import { CreateOfficerPresenceSchema } from "$lib/schemas/parking/officer_presence.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { OfficerPresence } from "$lib/types/parking/officer_presence.dto.js";

export const load: PageServerLoad = async ({ cookies }) => {
	const user = getUserContext(cookies);
	
	// Active attendance log list
	const items: OfficerPresence[] = [];

	return {
		items,
		currentUserId: String(user?.userId ?? ""),
		currentBranchId: user?.branchId || "1",
	};
};

export const actions: Actions = {
	clockIn: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const officer_user_id = Number(formData.get("officer_user_id") || String(user?.userId ?? "") || 1);
		const shift_id = Number(formData.get("shift_id") || 1);
		const status = (formData.get("status")?.toString() || "PRESENT") as any;

		const parse = CreateOfficerPresenceSchema.safeParse({
			branch_id,
			officer_user_id,
			shift_id,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await officerPresenceService.clockIn(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal melakukan clock-in" });
		}
	},

	clockOut: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID presensi tidak ditemukan" });

		try {
			await officerPresenceService.clockOut(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal melakukan clock-out" });
		}
	},
};
