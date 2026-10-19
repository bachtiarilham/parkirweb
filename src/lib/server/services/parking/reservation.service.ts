import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	ParkReservation,
	CreateReservationRequest,
	UpdateReservationRequest,
} from "$lib/types/parking/reservation.dto.js";

export const reservationService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkReservation[]> {
		return apiClient<ParkReservation[]>(
			API_ENDPOINTS.PARKING.RESERVATIONS.LIST,
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
	): Promise<ParkReservation> {
		return apiClient<ParkReservation>(
			API_ENDPOINTS.PARKING.RESERVATIONS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateReservationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkReservation> {
		return apiClient.post<ParkReservation>(
			API_ENDPOINTS.PARKING.RESERVATIONS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async reserveSlot(
		data: Partial<CreateReservationRequest>,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkReservation> {
		return apiClient.post<ParkReservation>(
			API_ENDPOINTS.PARKING.RESERVATIONS.RESERVE_SLOT,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateReservationRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkReservation> {
		return apiClient.put<ParkReservation>(
			API_ENDPOINTS.PARKING.RESERVATIONS.UPDATE(id),
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
			API_ENDPOINTS.PARKING.RESERVATIONS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
