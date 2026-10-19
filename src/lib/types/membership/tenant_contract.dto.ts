export interface MemberTenantContract {
  id: number;
  code: string;
  tenant_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  billing_cycle_months: number;
  total_amount: number;
  status: string;
  payment_order_code?: string | null;
  created_at: string;
}

export interface CreateTenantContractRequest {
  code?: string;
  tenant_id: number;
  plan_id: number;
  start_date?: string | null;
  end_date?: string | null;
  billing_cycle_months?: number;
  total_amount: number;
  status?: string;
  payment_order_code?: string | null;
}

export interface UpdateTenantContractRequest {
  code?: string | null;
  tenant_id?: number | null;
  plan_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  billing_cycle_months?: number | null;
  total_amount?: number | null;
  status?: string | null;
  payment_order_code?: string | null;
}