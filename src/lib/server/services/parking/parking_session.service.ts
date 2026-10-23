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
			if (paramsOrOptions && ("fetch" in paramsOrOptions || "token" in paramsOrOptions)) {
				fetchFn = (paramsOrOptions as any).fetch;
				token = (paramsOrOptions as any).token ?? token;
			} else {
				params = paramsOrOptions as Record<string, any> | undefined;
				fetchFn = options.fetch;
				token = options.token ?? token;
			}
		} else if (typeof tokenOrParams === "object" && tokenOrParams !== null) {
			// Deteksi apakah argumen pertama adalah options { fetch, token }
			if ("fetch" in tokenOrParams && typeof (tokenOrParams as any).fetch === "function") {
				fetchFn = (tokenOrParams as any).fetch;
				token = (tokenOrParams as any).token;
				params = paramsOrOptions as Record<string, any> | undefined;
			} else {
				params = tokenOrParams;
				const opts = paramsOrOptions as { fetch?: typeof fetch; token?: string | null } | undefined;
				fetchFn = opts?.fetch;
				token = opts?.token;
			}
		} else {
			fetchFn = options.fetch;
		}

		if (params && "fetch" in params) {
			const { fetch: _, ...rest } = params as any;
			params = rest;
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
		tokenOrOptions?: string | null | { fetch?: typeof fetch },
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingSession> {
		const token = typeof tokenOrOptions === "string" ? tokenOrOptions : undefined;
		const actualOptions = typeof tokenOrOptions === "object" && tokenOrOptions !== null ? tokenOrOptions : options;
		return apiClient<ParkingSession>(
			API_ENDPOINTS.PARKING.SESSIONS.GET_BY_ID(id),
			{
				fetch: actualOptions.fetch,
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
