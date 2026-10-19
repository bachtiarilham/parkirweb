import { getUserContext } from "$lib/utils/getCookies.js";
import { parkingSessionService } from "$lib/server/services/parking/parking_session.service.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { ParkingSession } from "$lib/types/parking/parking_session.dto.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	
	try {
		const items = await parkingSessionService.getAll(undefined, undefined, { fetch });
		return {
			items: (Array.isArray(items) ? items : []) as ParkingSession[],
		};
	} catch (error) {
		console.error("[ParkingSessionsPage] Error:", error);
		return {
			items: [] as ParkingSession[],
			error: error instanceof Error ? error.message : "Gagal memuat sesi parkir",
		};
	}
};
