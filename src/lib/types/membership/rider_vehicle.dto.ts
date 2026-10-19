import type { VehicleQuotaDto } from "../analytics/member_dashboard.dto.js";

export interface VehicleItemDto {
	id: number;
	contractId: number;
	licensePlate: string;
	vehicleModel?: string | null;
	vehicleType: string;
	isActive: boolean;
	registeredAt: string;
}

export interface RegisterVehicleRequestDto {
	contractId: number;
	licensePlate: string;
	vehicleModel?: string | null;
	vehicleType: "CAR" | "MOTORCYCLE" | "BUS" | "TRUCK" | string;
}

export interface ToggleActiveVehicleRequestDto {
	contractId: number;
	vehicleId: number;
}

export interface UpdateVehicleRequestDto {
	licensePlate?: string | null;
	vehicleModel?: string | null;
	vehicleType?: "CAR" | "MOTORCYCLE" | "BUS" | "TRUCK" | string | null;
}

export interface VehicleListResponse {
	vehicles: VehicleItemDto[];
	vehicleQuota: VehicleQuotaDto;
}
