import { getUserContext } from "$lib/utils/getCookies.js";
import { adService } from "$lib/server/services/ad/ad.service.js";
import { CreateAdSchema } from "$lib/schemas/ad/ad.schema.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import type { Ad } from "$lib/types/ad/ad.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await adService.getActiveAds(undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as Ad[],
		};
	} catch (error) {
		console.error("[AdPage] Error fetching ads:", error);
		return {
			items: [] as Ad[],
			error: error instanceof Error ? error.message : "Gagal memuat iklan",
		};
	}
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const user = getUserContext(cookies);
		if (!user) return fail(401, {  message: "Unauthorized"  });

		const formData = await request.formData();
		const title = formData.get("title")?.toString() || "";
		const tenant_id = formData.get("tenant_id")?.toString() || user?.tenantId || "1";
		const image_url = formData.get("image_url")?.toString() || undefined;
		const target_url = formData.get("target_url")?.toString() || undefined;
		const status = formData.get("status")?.toString() || "ACTIVE";

		const parse = CreateAdSchema.safeParse({ title, tenant_id, image_url, target_url, status });
		if (!parse.success) return fail(400, { message: parse.error.issues[0]?.message });

		await adService.create(parse.data, undefined, { fetch });
		return { success: true };
	},
};
