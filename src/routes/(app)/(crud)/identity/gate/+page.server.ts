import { getUserContext } from "$lib/utils/getCookies.js";
import { gateService } from "$lib/server/services/identity/gate.service.js";
import { CreateGateSchema, UpdateGateSchema } from "$lib/schemas/identity/gate.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Gate } from "$lib/types/identity/gate.dto.js";

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {
	const user = getUserContext(cookies);
	const branchId = url.searchParams.get("branch_id") || (user?.branchId ? String(user.branchId) : "1");

	try {
		const items = await gateService.getAllByBranch(branchId, undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Gate[],
			currentBranchId: branchId,
		};
	} catch (error) {
		console.error("[GatesPage] Error:", error);
		return {
			items: [] as Gate[],
			currentBranchId: branchId,
			error: error instanceof Error ? error.message : "Gagal memuat daftar gerbang",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const branch_id = Number(formData.get("branch_id") || user?.branchId || 1);
		const tenant_id = Number(formData.get("tenant_id") || user?.tenantId || 1);
		const gate_name = formData.get("gate_name")?.toString() || "";
		const gate_type = (formData.get("gate_type")?.toString() || "IN") as any;
		const status = formData.get("status")?.toString() || "ACTIVE";
		const hardware_ip = formData.get("hardware_ip")?.toString() || "192.168.1.100";

		const parse = CreateGateSchema.safeParse({
			branch_id,
			tenant_id,
			gate_name,
			gate_type,
			status,
			hardware_ip,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await gateService.create(branch_id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal membuat gerbang" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		const branch_id = formData.get("branch_id")?.toString() || user?.branchId || "1";
		if (!id) return fail(400, { message: "ID gerbang tidak ditemukan" });

		const gate_name = formData.get("gate_name")?.toString() || undefined;
		const gate_type = (formData.get("gate_type")?.toString() || undefined) as any;
		const status = formData.get("status")?.toString() || undefined;
		const hardware_ip = formData.get("hardware_ip")?.toString() || undefined;

		const parse = UpdateGateSchema.safeParse({
			gate_name,
			gate_type,
			status,
			hardware_ip,
		});

		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message || "Input tidak valid" });

		try {
			await gateService.update(branch_id, id, parse.data, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal memperbarui gerbang" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		const branch_id = formData.get("branch_id")?.toString() || user?.branchId || "1";
		if (!id) return fail(400, { message: "ID tidak valid" });

		try {
			await gateService.delete(branch_id, id, undefined, { fetch });
			return { success: true };
		} catch (err: any) {
			if (err instanceof ApiError) return fail(err.status, { message: err.message });
			return fail(400, { message: err.message || "Gagal menghapus gerbang" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const branch_id = formData.get("branch_id")?.toString() || user?.branchId || "1";
		const ids = (formData.get("ids")?.toString() || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (ids.length === 0) return fail(400, { message: "Tidak ada gerbang dipilih" });

		try {
			await Promise.all(ids.map((id) => gateService.delete(branch_id, id, undefined, { fetch })));
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.message || "Gagal menghapus gerbang terpilih" });
		}
	},
};
