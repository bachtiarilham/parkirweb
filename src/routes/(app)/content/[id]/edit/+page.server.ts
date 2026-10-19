import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {

	return {
		page: {
			id: params.id,
			title: "Contoh Halaman Parkir",
			slug: "contoh-halaman",
			content: "Konten informasi operasional parkir.",
			template: "default",
			status: "published",
			publishedAt: new Date(),
		},
	};
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
