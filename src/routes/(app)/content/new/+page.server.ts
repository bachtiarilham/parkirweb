import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get("title");
		if (!title) {
			return fail(400, { message: "Title is required" });
		}
		redirect(302, "/content");
	},
};
