import { getUserContext } from "$lib/utils/getCookies.js";
import { alarmService } from "$lib/server/services/parking/alarm.service.js";
import { CreateGateAlarmSchema } from "$lib/schemas/parking/alarm.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { GateAlarm } from "$lib/types/parking/alarm.dto.js";

export const load: PageServerLoad = async ({ cookies }) => {
	
	// Initial alarms or empty list
	const items: GateAlarm[] = [];

	return {
		items,
	};
};

export const actions: Actions = {
	trigger: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const gate_id = Number(formData.get("gate_id") || 1);
		const handling_officer_id = formData.has("handling_officer_id") ? Number(formData.get("handling_officer_id")) : undefined;

		const parse = CreateGateAlarmSchema.safeParse({
			gate_id,
			handling_officer_id,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await alarmService.triggerAlarm(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal trigger alarm" });
		}
	},

	ack: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID alarm tidak ditemukan" });

		try {
			await alarmService.acknowledgeAlarm(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal acknowledge alarm" });
		}
	},
};
