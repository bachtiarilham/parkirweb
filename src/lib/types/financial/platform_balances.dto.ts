export interface PayPlatformBalance {
  id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
  updated_at?: string | null;
}

export interface CreatePlatformBalanceRequest {
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
}

export interface UpdatePlatformBalanceRequest {
  withdrawable_balance?: number | string | null;
  total_revenue_lifetime?: number | string | null;
}