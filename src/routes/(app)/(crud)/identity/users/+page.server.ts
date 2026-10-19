import { getUserContext } from "$lib/utils/getCookies.js";
import { userService } from "$lib/server/services/identity/user.service.js";
import { CreateUserSchema, UpdateUserSchema } from "$lib/schemas/identity/user.schema.js";
import { ApiError } from "$lib/server/api/client.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { User } from "$lib/types/identity/user.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const user = getUserContext(cookies);
	
	try {
		const result = await userService.getAll(undefined, undefined, { fetch });
		const rawUsers: any[] = Array.isArray(result)
			? result
			: result?.items || [];

		const users: User[] = rawUsers.map((u) => ({
			...u,
			id: String(u.id ?? u.user_id ?? ""),
			name: u.name ?? u.full_name ?? u.username ?? "",
			username: u.username ?? u.user_code ?? "",
			email: u.email ?? "",
			role: u.role ?? u.role_code ?? "admin",
			createdAt: u.createdAt ?? u.created_at,
		}));

		return {
			users,
			currentUserId: String(user?.userId ?? ""),
		};
	} catch (error) {
		console.error("[UsersPage] Gagal memuat daftar user dari backend:", error);
		return {
			users: [] as User[],
			currentUserId: String(user?.userId ?? ""),
			error: error instanceof Error ? error.message : "Gagal memuat pengguna",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) {
			return fail(401, { message: "Sesi tidak valid, silakan login kembali" });
		}

		const formData = await request.formData();
		const name = formData.get("name")?.toString() || "";
		const email = formData.get("email")?.toString() || "";
		const username = formData.get("username")?.toString() || "";
		const password = formData.get("password")?.toString() || undefined;
		const role = formData.get("role")?.toString() || "admin";
		const tenantId = formData.get("tenantId")?.toString() || (user.tenantId ? String(user.tenantId) : undefined);
		const branchId = formData.get("branchId")?.toString() || (user.branchId ? String(user.branchId) : undefined);

		const parseResult = CreateUserSchema.safeParse({
			name,
			email,
			username,
			password,
			role,
			tenantId,
			branchId,
		});

		if (!parseResult.success) {
			const msg = parseResult.error.issues[0]?.message || "Input tidak valid";
			return fail(400, { message: msg });
		}

		try {
			await userService.create(
				{
					full_name: parseResult.data.name,
					username: parseResult.data.username,
					email: parseResult.data.email,
					password: parseResult.data.password,
					role: parseResult.data.role as any,
					tenantId: parseResult.data.tenantId,
					branchId: parseResult.data.branchId,
				},
				undefined,
				{ fetch }
			);
			return { success: true };
		} catch (error: any) {
			if (error instanceof ApiError) {
				return fail(error.status, {
					message: error.message,
					errors: error.errors,
				});
			}
			return fail(400, { message: error?.message || "Gagal membuat user" });
		}
	},

	update: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) {
			return fail(401, { message: "Sesi tidak valid, silakan login kembali" });
		}

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID user wajib disertakan" });

		const name = formData.get("name")?.toString() || undefined;
		const email = formData.get("email")?.toString() || undefined;
		const username = formData.get("username")?.toString() || undefined;
		const role = formData.get("role")?.toString() as any;

		const parseResult = UpdateUserSchema.safeParse({
			name,
			email,
			username,
			role,
		});

		if (!parseResult.success) {
			const msg = parseResult.error.issues[0]?.message || "Input tidak valid";
			return fail(400, { message: msg });
		}

		try {
			await userService.update(id, parseResult.data, undefined, { fetch });
			return { success: true };
		} catch (error: any) {
			if (error instanceof ApiError) {
				return fail(error.status, {
					message: error.message,
					errors: error.errors,
				});
			}
			return fail(400, { message: error?.message || "Gagal memperbarui user" });
		}
	},

	delete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) {
			return fail(401, { message: "Sesi tidak valid, silakan login kembali" });
		}

		const formData = await request.formData();
		const id = formData.get("id")?.toString();
		if (!id) return fail(400, { message: "ID user tidak ditemukan" });

		try {
			await userService.delete(id, undefined, { fetch });
			return { success: true };
		} catch (error: any) {
			if (error instanceof ApiError) {
				return fail(error.status, { message: error.message });
			}
			return fail(400, { message: error?.message || "Gagal menghapus user" });
		}
	},

	bulkDelete: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) {
			return fail(401, { message: "Sesi tidak valid" });
		}

		const formData = await request.formData();
		const idsRaw = formData.get("ids")?.toString() || "";
		const ids = idsRaw.split(",").map((s) => s.trim()).filter(Boolean);

		if (ids.length === 0) {
			return fail(400, { message: "Tidak ada user yang dipilih untuk dihapus" });
		}

		try {
			await Promise.all(
				ids.map((id) => userService.delete(id, undefined, { fetch }))
			);
			return { success: true };
		} catch (error: any) {
			return fail(400, {
				message: error?.message || "Gagal menghapus beberapa user",
			});
		}
	},
};
