import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	OfficerPresence,
	CreateOfficerPresenceRequest,
} from "$lib/types/parking/officer_presence.dto.js";

export const officerPresenceService = {
	/**
	 * Clock-in presensi petugas (POST /api/v1/operational/presence/clockin)
	 */
	async clockIn(
		data: CreateOfficerPresenceRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<OfficerPresence> {
		return apiClient.post<OfficerPresence>(
			API_ENDPOINTS.PARKING.OPERATIONAL.PRESENCE.CLOCK_IN,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	/**
	 * Clock-out presensi petugas (POST /api/v1/operational/presence/clockout/:id)
	 */
	async clockOut(
		presenceId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post<{ success: boolean; message?: string }>(
			API_ENDPOINTS.PARKING.OPERATIONAL.PRESENCE.CLOCK_OUT(presenceId),
			{},
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
