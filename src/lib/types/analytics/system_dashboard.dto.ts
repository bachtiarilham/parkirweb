export interface PlatformDashboardData {
  identity_data: PlatformIdentityData;
  financial_data: PlatformFinancialData;
  parking_data: null; // atau ParkingData | null jika nanti ada payload
}

// ================= Identity Data =================

export interface PlatformIdentityData {
  total_active_tenants: number;
  total_active_branches: number;
  total_active_gates: number;
}

// ================= Financial Data =================

export interface PlatformFinancialData {
  revenue_stats: RevenueStats;
  platform_fund: PlatformFund;
  reconciliation: Reconciliation;
  escrow_fund: EscrowFund;
  live_throughput: LiveThroughput;
}

export interface RevenueStats {
  total_gtv_lifetime: string;
  total_gtv_today: string;
  total_gtv_this_month: string;
  platform_net_revenue_lifetime: string;
  platform_net_revenue_today: string;
}

export interface PlatformFund {
  platform_net_revenue_withdrawable: string;
}

export interface Reconciliation {
  unreconciled_items_count: number;
  unreconciled_discrepancy_amount: string;
  nightly_match_success_rate: number;
}

export interface EscrowFund {
  total_escrow_balance: string;
}

export interface LiveThroughput {
  transactions_per_second: number;
}