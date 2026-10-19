export interface PayTenantBalance {
  id: number;
  tenant_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
  updated_at?: string | null;
}

export interface CreateTenantBalanceRequest {
  tenant_id: number;
  withdrawable_balance: number | string;
  total_revenue_lifetime: number | string;
}

export interface UpdateTenantBalanceRequest {
  tenant_id?: number | null;
  withdrawable_balance?: number | string | null;
  total_revenue_lifetime?: number | string | null;
}