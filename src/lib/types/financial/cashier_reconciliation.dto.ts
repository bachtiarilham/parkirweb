export interface PayCashierReconciliation {
  id: number;
  code: string;
  shift_id: number;
  officer_user_id: number;
  expected_cash_revenue: number | string;
  actual_cash_reported: number | string;
  leakage_amount: number | string;
  status: string;
}

export interface CreateCashierReconciliationRequest {
  code?: string;
  shift_id: number;
  officer_user_id: number;
  expected_cash_revenue: number | string;
  actual_cash_reported: number | string;
  status?: string;
}

export interface UpdateCashierReconciliationRequest {
  code?: string | null;
  shift_id?: number | null;
  officer_user_id?: number | null;
  expected_cash_revenue?: number | string | null;
  actual_cash_reported?: number | string | null;
  status?: string | null;
}