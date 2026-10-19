import { getUserContext } from "$lib/utils/getCookies.js";
import { tenantPlanService } from "$lib/server/services/membership/tenant_plan.service.js";
import { CreateTenantPlanSchema, UpdateTenantPlanSchema } from "$lib/schemas/membership/tenant_plan.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { MemberTenantPlan } from "$lib/types/membership/tenant_plan.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await tenantPlanService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as MemberTenantPlan[],
		};
	} catch (error) {
		console.error("[TenantPlanPage] Error:", error);
		return {
			items: [] as MemberTenantPlan[],
			error: error instanceof Error ? error.message : "Gagal memuat paket tenant",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const member_tenant_plan_code = formData.get("member_tenant_plan_code")?.toString() || "";
		const member_tenant_plan_name = formData.get("member_tenant_plan_name")?.toString() || "";
		const price_per_month = Number(formData.get("price_per_month") || 0);
		const max_branches = Number(formData.get("max_branches") || 1);
		const max_gates = Number(formData.get("max_gates") || 1);
		const is_active = formData.get("is_active") !== "false";

		const parse = CreateTenantPlanSchema.safeParse({
			member_tenant_plan_code,
			member_tenant_plan_name,
			price_per_month,
			max_branches,
			max_gates,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantPlanService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat paket tenant" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID paket tidak ditemukan" });

		const member_tenant_plan_name = formData.get("member_tenant_plan_name")?.toString() || undefined;
		const price_per_month = formData.has("price_per_month") ? Number(formData.get("price_per_month")) : undefined;
		const max_branches = formData.has("max_branches") ? Number(formData.get("max_branches")) : undefined;
		const max_gates = formData.has("max_gates") ? Number(formData.get("max_gates")) : undefined;
		const is_active = formData.has("is_active") ? formData.get("is_active") === "true" : undefined;

		const parse = UpdateTenantPlanSchema.safeParse({
			member_tenant_plan_name,
			price_per_month,
			max_branches,
			max_gates,
			is_active,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantPlanService.update(id, parse.data, undefined, { fetch });
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
			await tenantPlanService.delete(id, undefined, { fetch });
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
			await Promise.all(ids.map((id) => tenantPlanService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus paket terpilih" });
		}
	},
};
