import { getUserContext } from "$lib/utils/getCookies.js";
import { branchService } from "$lib/server/services/identity/branch.service.js";
import { CreateBranchSchema, UpdateBranchSchema } from "$lib/schemas/identity/branch.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Branch } from "$lib/types/identity/branch.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await branchService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Branch[],
		};
	} catch (error) {
		console.error("[BranchesPage] Error:", error);
		return {
			items: [] as Branch[],
			error: error instanceof Error ? error.message : "Gagal memuat cabang",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const branch_name = formData.get("branch_name")?.toString() || "";
		const zona = (formData.get("zona")?.toString() || "NORMAL") as any;
		const address = formData.get("address")?.toString() || undefined;
		const branch_type = formData.get("branch_type")?.toString() || "STANDALONE";
		const status = formData.get("status")?.toString() || "ACTIVE";
		const platform_commission_rate = Number(formData.get("platform_commission_rate") || 0);
		const tax_rate = Number(formData.get("tax_rate") || 0);
		const officer_commission_rate = Number(formData.get("officer_commission_rate") || 0);
		const branch_commission_rate = Number(formData.get("branch_commission_rate") || 0);

		const parse = CreateBranchSchema.safeParse({
			tenant_id,
			branch_name,
			zona,
			address,
			branch_type,
			status,
			platform_commission_rate,
			tax_rate,
			officer_commission_rate,
			branch_commission_rate,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await branchService.create(parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat cabang" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID cabang tidak ditemukan" });

		const branch_name = formData.get("branch_name")?.toString() || undefined;
		const zona = (formData.get("zona")?.toString() || undefined) as any;
		const address = formData.get("address")?.toString() || undefined;
		const branch_type = formData.get("branch_type")?.toString() || undefined;
		const status = formData.get("status")?.toString() || undefined;
		const platform_commission_rate = formData.has("platform_commission_rate") ? Number(formData.get("platform_commission_rate")) : undefined;
		const tax_rate = formData.has("tax_rate") ? Number(formData.get("tax_rate")) : undefined;
		const officer_commission_rate = formData.has("officer_commission_rate") ? Number(formData.get("officer_commission_rate")) : undefined;
		const branch_commission_rate = formData.has("branch_commission_rate") ? Number(formData.get("branch_commission_rate")) : undefined;

		const parse = UpdateBranchSchema.safeParse({
			branch_name,
			zona,
			address,
			branch_type,
			status,
			platform_commission_rate,
			tax_rate,
			officer_commission_rate,
			branch_commission_rate,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await branchService.update(id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui cabang" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await branchService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus cabang" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada cabang dipilih" });

		try {
			await Promise.all(ids.map((id) => branchService.delete(id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus cabang terpilih" });
		}
	},
};
