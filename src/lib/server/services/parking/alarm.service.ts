import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	GateAlarm,
	CreateGateAlarmRequest,
} from "$lib/types/parking/alarm.dto.js";

export const alarmService = {
	/**
	 * Trigger alarm operasional gerbang (POST /api/v1/operational/alarm/alarm/trigger)
	 */
	async triggerAlarm(
		data: CreateGateAlarmRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<GateAlarm> {
		return apiClient.post<GateAlarm>(
			API_ENDPOINTS.PARKING.OPERATIONAL.ALARM.TRIGGER,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	/**
	 * Acknowledge alarm gerbang oleh petugas (POST /api/v1/operational/alarm/alarm/ack/:id)
	 */
	async acknowledgeAlarm(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.post<{ success: boolean; message?: string }>(
			API_ENDPOINTS.PARKING.OPERATIONAL.ALARM.ACKNOWLEDGE(id),
			{},
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
