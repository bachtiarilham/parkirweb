import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	ParkSlotsInventory,
	CreateSlotsInventoryRequest,
	UpdateSlotsInventoryRequest,
} from "$lib/types/parking/inventory.dto.js";

export const inventoryService = {
	async getAll(
		token?: string | null,
		params?: Record<string, any>,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkSlotsInventory[]> {
		return apiClient<ParkSlotsInventory[]>(
			API_ENDPOINTS.PARKING.INVENTORY.LIST,
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
	): Promise<ParkSlotsInventory> {
		return apiClient<ParkSlotsInventory>(
			API_ENDPOINTS.PARKING.INVENTORY.GET_BY_ID(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async create(
		data: CreateSlotsInventoryRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkSlotsInventory> {
		return apiClient.post<ParkSlotsInventory>(
			API_ENDPOINTS.PARKING.INVENTORY.CREATE,
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async update(
		id: string | number,
		data: UpdateSlotsInventoryRequest,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<ParkSlotsInventory> {
		return apiClient.put<ParkSlotsInventory>(
			API_ENDPOINTS.PARKING.INVENTORY.UPDATE(id),
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
			API_ENDPOINTS.PARKING.INVENTORY.DELETE(id),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
