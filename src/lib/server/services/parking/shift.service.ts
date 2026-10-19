import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	Shift,
	CreateShiftRequest,
	UpdateShiftRequest,
} from "$lib/types/parking/shift.dto.js";

export const shiftService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<Shift[]> {
		return apiClient<Shift[]>(API_ENDPOINTS.PARKING.SHIFTS.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Shift> {
		return apiClient<Shift>(API_ENDPOINTS.PARKING.SHIFTS.GET_BY_ID(id), {
			fetch: options.fetch,
			token,
		});
	},

	async create(
		data: CreateShiftRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Shift> {
		return apiClient.post<Shift>(API_ENDPOINTS.PARKING.SHIFTS.CREATE, data, {
			fetch: options.fetch,
			token,
		});
	},

	async update(
		id: string | number,
		data: UpdateShiftRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<Shift> {
		return apiClient.put<Shift>(
			API_ENDPOINTS.PARKING.SHIFTS.UPDATE(id),
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
			API_ENDPOINTS.PARKING.SHIFTS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
