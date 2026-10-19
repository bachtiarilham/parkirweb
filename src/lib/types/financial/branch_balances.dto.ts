export interface PayBranchBalance {
  id: number;
  branch_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
  updated_at?: string | null;
}

export interface CreateBranchBalanceRequest {
  branch_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
}

export interface UpdateBranchBalanceRequest {
  branch_id?: number | null;
  withdrawable_balance?: number | string | null;
  total_revenue_lifetime?: number | string | null;
}