import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	ParkingSession,
	CreateParkingSessionRequest,
	UpdateParkingSessionRequest,
} from "$lib/types/parking/parking_session.dto.js";

export const parkingSessionService = {
	async getAll(
		tokenOrParams?: string | null | Record<string, any>,
		paramsOrOptions?: Record<string, any> | { fetch?: typeof fetch; token?: string | null },
		options: { fetch?: typeof fetch; token?: string | null } = {}
	): Promise<ParkingSession[]> {
		let token: string | null | undefined = undefined;
		let params: Record<string, any> | undefined = undefined;
		let fetchFn: typeof fetch | undefined = undefined;

		if (typeof tokenOrParams === "string" || tokenOrParams === null) {
			token = tokenOrParams;
			params = paramsOrOptions as Record<string, any> | undefined;
			fetchFn = options.fetch;
		} else if (typeof tokenOrParams === "object" && tokenOrParams !== null) {
			params = tokenOrParams;
			const opts = paramsOrOptions as { fetch?: typeof fetch; token?: string | null } | undefined;
			fetchFn = opts?.fetch;
			token = opts?.token;
		} else {
			fetchFn = options.fetch;
		}

		return apiClient<ParkingSession[]>(
			API_ENDPOINTS.PARKING.SESSIONS.LIST,
			{
				fetch: fetchFn,
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
		options: { fetch?: typeof fetch; idempotencyKey?: string } = {}
	): Promise<ParkingSession> {
		const headers: Record<string, string> = {};
		if (options.idempotencyKey) {
			headers["Idempotency-Key"] = options.idempotencyKey;
		}

		return apiClient.post<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.CHECKIN,
			data,
			{
				fetch: options.fetch,
				token,
				headers,
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
