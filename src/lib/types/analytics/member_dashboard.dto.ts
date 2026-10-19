export interface VehicleQuotaDto {
	maxVehicles: number;
	registeredCount: number;
	canAddMore: boolean;
}

export interface AllowedTenantDto {
	tenantId: number;
	tenantName: string;
}

export interface FeatureItemDto {
	code: string;
	name: string;
}

export interface SubscriptionSummaryResponseDto {
	membershipId: string;
	planId: number;
	planCode: string;
	planName: string;
	price: string | number;
	status: string;
	rfidCardNo: string;
	activePlateNumber: string;
	startDate: string;
	endDate: string;
	daysRemaining: number;
	isAutoRenew: boolean;
	vehicleQuota: VehicleQuotaDto;
	allowedTenants?: AllowedTenantDto[];
	features?: FeatureItemDto[];
}

import type { ParkingSession } from "../parking/parking_session.dto.js";
import type { PayOrder } from "../financial/order.dto.js";

export type { ParkingSession, PayOrder };

export interface MemberDashboard {
	membership_data: SubscriptionSummaryResponseDto | null;
	parking_data: ParkingSession[];
	financial_data: PayOrder[];
}

export interface RenewSubscriptionRequestDto {
	membershipId: string;
	paymentMethod?: string;
}

export interface RenewSubscriptionResponseDto {
	renewalId: number;
	membershipId: string;
	orderCode: string;
	amount: string | number;
	snapToken?: string | null;
	redirectUrl?: string | null;
	newExpiryDate: string;
	paymentStatus: string;
}
