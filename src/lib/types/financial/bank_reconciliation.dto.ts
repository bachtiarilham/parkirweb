export interface PayBankReconciliation {
  id: number;
  payment_order_code: string;
  psp_reference_id?: string | null;
  internal_amount: number | string;
  external_amount?: number | string | null;
  status: string;
  reconciled_at?: string | null;
  notes?: string | null;
  estimated_pg_fee: number | string;
  actual_pg_fee?: number | string | null;
}

export interface CreateBankReconciliationRequest {
  payment_order_code: string;
  psp_reference_id?: string | null;
  internal_amount: number | string;
  external_amount?: number | string | null;
  status?: string;
  reconciled_at?: string | null;
  notes?: string | null;
  estimated_pg_fee?: number | string;
  actual_pg_fee?: number | string | null;
}

export interface UpdateBankReconciliationRequest {
  payment_order_code?: string | null;
  psp_reference_id?: string | null;
  internal_amount?: number | string | null;
  external_amount?: number | string | null;
  status?: string | null;
  reconciled_at?: string | null;
  notes?: string | null;
  estimated_pg_fee?: number | string | null;
  actual_pg_fee?: number | string | null;
}