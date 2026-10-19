export interface PayOfficerBalance {
  id: number;
  officer_user_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
  updated_at?: string | null;
}

export interface CreateOfficerBalanceRequest {
  officer_user_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
}

export interface UpdateOfficerBalanceRequest {
  officer_user_id?: number | null;
  withdrawable_balance?: number | string | null;
  total_revenue_lifetime?: number | string | null;
}