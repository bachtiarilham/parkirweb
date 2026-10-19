import { getUserContext } from "$lib/utils/getCookies.js";
import { sessionService } from "$lib/server/services/identity/session.service.js";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
	const user = getUserContext(cookies);
	
	const currentUser = {
		id: String(user?.userId ?? ""),
		name: user?.fullName || "User",
		email: user?.email || "",
		role: user?.roleCode || "admin",
	};

	// Active session for current user
	const sessionData = [
		{
			id: "current",
			userId: String(user?.userId ?? ""),
			userName: currentUser.name,
			userRole: currentUser.role,
			tenantId: user?.tenantId ? String(user?.tenantId) : "1",
			branchId: user?.branchId ? String(user?.branchId) : "1",
			status: "ACTIVE",
			lastActive: new Date().toISOString(),
			device: "Current Web Session",
		},
	];

	return {
		sessions: sessionData,
		currentUser,
	};
};

export const actions: Actions = {
	revoke: async ({ fetch, cookies }) => {
		if (!undefined) return fail(401, { message: "Sesi tidak ditemukan" });

		try {
			await sessionService.revokeSession(undefined, { fetch });
		} catch (e) {
			console.error("Revoke error:", e);
		}

		cookies.delete("access_token", { path: "/" });
		cookies.delete("refresh_token", { path: "/" });
		redirect(302, "/login");
	},
};
