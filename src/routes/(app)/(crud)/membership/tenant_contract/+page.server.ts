import { getUserContext } from "$lib/utils/getCookies.js";
import { tenantContractService } from "$lib/server/services/membership/tenant_contract.service.js";
import { CreateTenantContractSchema, UpdateTenantContractSchema } from "$lib/schemas/membership/tenant_contract.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { MemberTenantContract } from "$lib/types/membership/tenant_contract.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await tenantContractService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as MemberTenantContract[],
		};
	} catch (error) {
		console.error("[TenantContractPage] Error:", error);
		return {
			items: [] as MemberTenantContract[],
			error: error instanceof Error ? error.message : "Gagal memuat kontrak tenant",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const code = formData.get("code")?.toString() || undefined;
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const plan_id = Number(formData.get("plan_id") || 1);
		const start_date = formData.get("start_date")?.toString() || undefined;
		const end_date = formData.get("end_date")?.toString() || undefined;
		const billing_cycle_months = Number(formData.get("billing_cycle_months") || 12);
		const total_amount = Number(formData.get("total_amount") || 0);
		const status = formData.get("status")?.toString() || "ACTIVE";

		const parse = CreateTenantContractSchema.safeParse({
			code,
			tenant_id,
			plan_id,
			start_date,
			end_date,
			billing_cycle_months,
			total_amount,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantContractService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat kontrak tenant" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID kontrak tidak ditemukan" });

		const plan_id = formData.has("plan_id") ? Number(formData.get("plan_id")) : undefined;
		const billing_cycle_months = formData.has("billing_cycle_months") ? Number(formData.get("billing_cycle_months")) : undefined;
		const total_amount = formData.has("total_amount") ? Number(formData.get("total_amount")) : undefined;
		const status = formData.get("status")?.toString() || undefined;
		const end_date = formData.get("end_date")?.toString() || undefined;

		const parse = UpdateTenantContractSchema.safeParse({
			plan_id,
			billing_cycle_months,
			total_amount,
			status,
			end_date,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantContractService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui kontrak" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await tenantContractService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus kontrak" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada kontrak dipilih" });

		try {
			await Promise.all(ids.map((id) => tenantContractService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus beberapa kontrak" });
		}
	},
};
