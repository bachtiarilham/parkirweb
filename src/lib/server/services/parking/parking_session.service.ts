import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	ParkingSession,
	CreateParkingSessionRequest,
	UpdateParkingSessionRequest,
} from "$lib/types/parking/parking_session.dto.js";

export const parkingSessionService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession[]> {
		return apiClient<ParkingSession[]>(
			API_ENDPOINTS.PARKING.SESSIONS.LIST,
			{
				fetch: options.fetch,
				token,
				params,
			}
		);
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession> {
		return apiClient<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateParkingSessionRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession> {
		return apiClient.post<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async checkIn(
		data: Partial<CreateParkingSessionRequest>,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession> {
		return apiClient.post<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.CHECKIN,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateParkingSessionRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession> {
		return apiClient.put<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.UPDATE(id),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async delete(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.PARKING.SESSIONS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
