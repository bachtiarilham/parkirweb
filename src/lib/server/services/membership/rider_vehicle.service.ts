import { apiClient, API_ENDPOINTS } from "../../api/index.js";
import type {
	VehicleItemDto,
	VehicleListResponse,
	RegisterVehicleRequestDto,
	ToggleActiveVehicleRequestDto,
	UpdateVehicleRequestDto,
} from "$lib/types/membership/rider_vehicle.dto.js";

export const riderVehicleService = {
	async getVehicles(
		contractId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<VehicleListResponse> {
		return apiClient<VehicleListResponse>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.VEHICLES.LIST(contractId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async registerVehicle(
		contractId: string | number,
		data: RegisterVehicleRequestDto,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<VehicleItemDto> {
		return apiClient.post<VehicleItemDto>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.VEHICLES.CREATE(contractId),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async updateVehicle(
		contractId: string | number,
		vehicleId: string | number,
		data: UpdateVehicleRequestDto,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<VehicleItemDto> {
		return apiClient.put<VehicleItemDto>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.VEHICLES.UPDATE(contractId, vehicleId),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async toggleActiveVehicle(
		contractId: string | number,
		data: ToggleActiveVehicleRequestDto,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.patch<{ success: boolean; message?: string }>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.VEHICLES.TOGGLE_ACTIVE(contractId),
			data,
			{
				fetch: options.fetch,
				token,
			}
		);
	},

	async deleteVehicle(
		contractId: string | number,
		vehicleId: string | number,
		token?: string | null,
		options: { fetch?: typeof fetch } = {}
	): Promise<{ success: boolean; message?: string }> {
		return apiClient.delete<{ success: boolean; message?: string }>(
			API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.VEHICLES.DELETE(contractId, vehicleId),
			{
				fetch: options.fetch,
				token,
			}
		);
	},
};
