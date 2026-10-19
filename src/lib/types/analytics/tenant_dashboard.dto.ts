export interface DashboardData {
  identity_data: IdentityData;
  financial_data: FinancialData;
  parking_data: ParkingData;
}

// ================= Identity Data =================

export interface IdentityData {
  tenant: Tenant;
  branches: BranchIdentity[];
}

export interface Tenant {
  tenant_id: number;
  tenant_code: string;
  tenant_name: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  package_active: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at: string;
  revoked_at: string | null;
  expired_at: string | null;
  updated_at: string;
  platform_commission_rate: string;
  tax_rate: string;
  tenant_commission_rate: string;
}

export interface BranchIdentity {
  branch_id: string;
  branch_code: string;
  branch_name: string;
  branch_type: 'OFFSTREET' | 'ONSTREET' | string;
  branch_status: 'ACTIVE' | 'ONLINE' | 'OFFLINE' | string;
}

// ================= Financial Data =================

export interface FinancialData {
  revenue_overview: RevenueOverview;
  balance: Balance;
  branch_financials: BranchFinancial[];
  recent_settlements: RecentSettlement[];
}

export interface RevenueOverview {
  total_gross_revenue_today: string;
  total_gross_revenue_this_week: string;
  total_gross_revenue_this_month: string;
  tenant_net_share_revenue_today: string;
  tenant_net_share_revenue_this_month: string;
}

export interface Balance {
  withdrawable_balance: string;
  total_revenue_lifetime: string;
}

export interface BranchFinancial {
  branch_id: number;
  gross_revenue: string;
  tenant_net_share: string;
}

export interface RecentSettlement {
  order_id: string;
  payment_order_code: string;
  total_amount: string;
  platform_fee_deducted: string;
  tax_amount_deducted: string;
  net_payout_amount: string;
  payout_status: 'SUCCESS' | 'FAILED' | 'PENDING' | string;
  processed_at: string;
}

// ================= Parking Data =================

export interface ParkingData {
  vehicle_stats: VehicleStats;
  capacity_utilisation: CapacityUtilisation;
  branch_operations: BranchOperation[];
}

export interface VehicleStats {
  total_vehicles_served_today: number;
  cars_count: number;
  motorcycles_count: number;
  average_parking_duration_minutes: number;
}

export interface CapacityUtilisation {
  average_capacity_utilisation: number;
}

export interface BranchOperation {
  branch_id: number;
  total_vehicles_today: number;
  average_occupancy_today: number;
}