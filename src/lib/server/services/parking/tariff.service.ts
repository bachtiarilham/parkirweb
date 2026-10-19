import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	ParkingTariff,
	CreateTariffRequest,
	UpdateTariffRequest,
} from "$lib/types/parking/tariff.dto.js";

export const tariffService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingTariff[]> {
		return apiClient<ParkingTariff[]>(API_ENDPOINTS.PARKING.TARIFFS.LIST, {
			fetch: options.fetch,
			token,
			params,
		});
	},

	async getById(
		id: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingTariff> {
		return apiClient<ParkingTariff>(
			API_ENDPOINTS.PARKING.TARIFFS.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateTariffRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingTariff> {
		return apiClient.post<ParkingTariff>(
			API_ENDPOINTS.PARKING.TARIFFS.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateTariffRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkingTariff> {
		return apiClient.put<ParkingTariff>(
			API_ENDPOINTS.PARKING.TARIFFS.UPDATE(id),
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
			API_ENDPOINTS.PARKING.TARIFFS.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
