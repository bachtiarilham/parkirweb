import { getUserContext } from "$lib/utils/getCookies.js";
import { tenantService } from "$lib/server/services/identity/tenant.service.js";
import { CreateTenantSchema, UpdateTenantSchema } from "$lib/schemas/identity/tenant.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Tenant } from "$lib/types/identity/tenant.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await tenantService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Tenant[],
		};
	} catch (error) {
		console.error("[TenantsPage] Error:", error);
		return {
			items: [] as Tenant[],
			error: error instanceof Error ? error.message : "Gagal memuat tenant",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const name = formData.get("name")?.toString() || "";
		const bank_name = formData.get("bank_name")?.toString() || "";
		const bank_account_number = formData.get("bank_account_number")?.toString() || "";
		const bank_account_name = formData.get("bank_account_name")?.toString() || "";
		const package_active = formData.get("package_active")?.toString() || "BASIC";
		const status = formData.get("status")?.toString() || "ACTIVE";
		const platform_commission_rate = Number(formData.get("platform_commission_rate") || 0);
		const tenant_commission_rate = Number(formData.get("tenant_commission_rate") || 0);
		const tax_rate = Number(formData.get("tax_rate") || 0);

		const parse = CreateTenantSchema.safeParse({
			name,
			bank_name,
			bank_account_number,
			bank_account_name,
			package_active,
			status,
			platform_commission_rate,
			tenant_commission_rate,
			tax_rate,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat tenant" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tenant tidak ditemukan" });

		const tenant_name = formData.get("tenant_name")?.toString() || undefined;
		const bank_name = formData.get("bank_name")?.toString() || undefined;
		const bank_account_number = formData.get("bank_account_number")?.toString() || undefined;
		const bank_account_name = formData.get("bank_account_name")?.toString() || undefined;
		const package_active = formData.get("package_active")?.toString() || undefined;
		const status = formData.get("status")?.toString() || undefined;

		const parse = UpdateTenantSchema.safeParse({
			tenant_name,
			bank_name,
			bank_account_number,
			bank_account_name,
			package_active,
			status,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await tenantService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui tenant" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await tenantService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus tenant" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada tenant dipilih" });

		try {
			await Promise.all(ids.map((id) => tenantService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus tenant terpilih" });
		}
	},
};
