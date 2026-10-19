import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get("email");

		if (typeof email !== "string" || !email.includes("@")) {
			return fail(400, { message: "Please provide a valid email address" });
		}

		return {
			success: true,
			message: "If an account with that email exists, password reset instructions have been sent.",
		};
	},
};
