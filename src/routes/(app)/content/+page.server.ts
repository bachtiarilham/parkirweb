import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

const samplePages = [
	{
		id: "page-1",
		title: "Ketentuan Tarif Parkir",
		slug: "tarif-parkir",
		template: "default",
		status: "published",
		authorName: "Administrator",
		createdAt: new Date("2026-01-01"),
		updatedAt: new Date("2026-01-02"),
		publishedAt: new Date("2026-01-02"),
	},
	{
		id: "page-2",
		title: "Panduan Member & Langganan",
		slug: "panduan-member",
		template: "landing",
		status: "published",
		authorName: "Operator Parkir 1",
		createdAt: new Date("2026-01-10"),
		updatedAt: new Date("2026-01-11"),
		publishedAt: new Date("2026-01-11"),
	},
];

export const load: PageServerLoad = async () => {
	return { pages: samplePages };
};

type ActionRes = { success: boolean; message?: string };

export const actions: Actions = {
	delete: async (): Promise<ActionRes> => {
		return { success: true };
	},
	bulkDelete: async (): Promise<ActionRes> => {
		return { success: true };
	},
};
