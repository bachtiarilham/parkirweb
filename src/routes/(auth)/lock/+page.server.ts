import { fail, redirect } from "@sveltejs/kit";
import { getUserContext } from "$lib/utils/getCookies.js";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
	const userContext = getUserContext(cookies);
	if (!userContext) {
		redirect(302, "/login");
	}
	return {
		user: {
			name: userContext.fullName || "User",
			email: userContext.email || "",
			username: userContext.fullName || "User",
		},
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const userContext = getUserContext(cookies);
		if (!userContext) {
			redirect(302, "/login");
		}

		const formData = await request.formData();
		const password = formData.get("password");

		if (typeof password !== "string" || password.length < 1) {
			return fail(400, { message: "Password is required" });
		}

		// Unlock screen & redirect back to dashboard
		redirect(302, "/");
	},
};
