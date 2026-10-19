import { getUserContext } from "$lib/utils/getCookies.js";
import { ACCESS_TOKEN_COOKIE } from "../hooks.server.ts";
import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const userContext = getUserContext(cookies);
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;

	const user = userContext
		? {
				id: String(userContext.userId ?? ""),
				user_id: userContext.userId,
				name: userContext.fullName,
				full_name: userContext.fullName,
				email: userContext.email,
				role_code: userContext.roleCode,
				role: userContext.roleCode,
				tenantId: userContext.tenantId ? String(userContext.tenantId) : null,
				tenantCode: userContext.tenantCode,
				branchId: userContext.branchId ? String(userContext.branchId) : null,
				branchCode: userContext.branchCode,
			}
		: null;

	return {
		user,
		token
	};
};
