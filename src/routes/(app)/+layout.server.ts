import { getUserContext } from "$lib/utils/getCookies.js";
import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const userContext = getUserContext(cookies);

	const user = userContext
		? {
				id: String(userContext.userId ?? ""),
				name: userContext.fullName,
				email: userContext.email,
				role: userContext.roleCode ?? "",
				role_code: userContext.roleCode,
				tenantId: userContext.tenantId ? String(userContext.tenantId) : null,
				tenantCode: userContext.tenantCode,
				branchId: userContext.branchId ? String(userContext.branchId) : null,
				branchCode: userContext.branchCode,
			}
		: null;

	return {
		user,
		unreadNotificationCount: 1,
		recentNotifications: [
			{
				id: "notif-1",
				title: "Selamat Datang di Web Parkir",
				message: "Sistem parkir siap digunakan.",
				type: "info",
				createdAt: new Date(),
			},
		],
	};
};
