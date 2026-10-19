import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get("token");
	if (!token) {
		return { valid: false, validToken: false };
	}
	return { valid: true, validToken: true, token };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const password = formData.get("password");
		const confirmPassword = formData.get("confirmPassword");

		if (typeof password !== "string" || password.length < 6) {
			return fail(400, { message: "Password must be at least 6 characters" });
		}
		if (password !== confirmPassword) {
			return fail(400, { message: "Passwords do not match" });
		}

		redirect(302, "/login");
	},
};
