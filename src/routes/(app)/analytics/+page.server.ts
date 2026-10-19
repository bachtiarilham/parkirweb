import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	return {
		signupsPerMonth: [
			{ month: "2026-01-01", count: 12 },
			{ month: "2026-02-01", count: 19 },
			{ month: "2026-03-01", count: 28 },
		],
		pagesPerMonth: [
			{ month: "2026-01-01", count: 4 },
			{ month: "2026-02-01", count: 6 },
			{ month: "2026-03-01", count: 10 },
		],
		pagesByStatus: [
			{ status: "published", count: 8 },
			{ status: "draft", count: 2 },
		],
		notificationsByType: [
			{ type: "info", count: 12 },
			{ type: "success", count: 8 },
			{ type: "warning", count: 3 },
		],
		topAuthors: [
			{ name: "Administrator", pageCount: 6 },
			{ name: "Operator Parkir 1", pageCount: 4 },
		],
	};
};
