import { getUserContext } from "$lib/utils/getCookies.js";
import { riderPlanService } from "$lib/server/services/membership/rider_plan.service.js";
import { CreateRiderPlanSchema, UpdateRiderPlanSchema } from "$lib/schemas/membership/rider_plan.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { MemberRiderPlan } from "$lib/types/membership/rider_plan.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await riderPlanService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as MemberRiderPlan[],
		};
	} catch (error) {
		console.error("[RiderPlanPage] Error:", error);
		return {
			items: [] as MemberRiderPlan[],
			error: error instanceof Error ? error.message : "Gagal memuat paket member",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const member_rider_plan_code = formData.get("member_rider_plan_code")?.toString() || "";
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const member_rider_plan_name = formData.get("member_rider_plan_name")?.toString() || "";
		const member_rider_plan_price = Number(formData.get("member_rider_plan_price") || 0);
		const duration_days = Number(formData.get("duration_days") || 30);
		const vehicle_limit = Number(formData.get("vehicle_limit") || 1);
		const is_active = formData.get("is_active") !== "false";

		const parse = CreateRiderPlanSchema.safeParse({
			member_rider_plan_code,
			tenant_id,
			member_rider_plan_name,
			member_rider_plan_price,
			duration_days,
			vehicle_limit,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await riderPlanService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat paket member" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID paket tidak ditemukan" });

		const member_rider_plan_name = formData.get("member_rider_plan_name")?.toString() || undefined;
		const member_rider_plan_price = formData.has("member_rider_plan_price") ? Number(formData.get("member_rider_plan_price")) : undefined;
		const duration_days = formData.has("duration_days") ? Number(formData.get("duration_days")) : undefined;
		const vehicle_limit = formData.has("vehicle_limit") ? Number(formData.get("vehicle_limit")) : undefined;
		const is_active = formData.has("is_active") ? formData.get("is_active") === "true" : undefined;

		const parse = UpdateRiderPlanSchema.safeParse({
			member_rider_plan_name,
			member_rider_plan_price,
			duration_days,
			vehicle_limit,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await riderPlanService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui paket" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await riderPlanService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus paket" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada paket dipilih" });

		try {
			await Promise.all(ids.map((id) => riderPlanService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus paket terpilih" });
		}
	},
};
