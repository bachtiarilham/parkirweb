export interface PayTransaction {
  id: number;
  code: string;
  reference_code?: string | null;
  metadata?: string | null;
  type: string;
  amount: number | string;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  snap_token?: string | null;
  redirect_url?: string | null;
  payment_expiry?: string | null;
  pg_fee: number | string;
  net_amount: number | string;
}

export interface CreateTransactionRequest {
  code?: string;
  reference_code?: string | null;
  metadata?: string | null;
  type: string;
  amount: number | string;
  currency?: string;
  payment_method: string;
  status?: string;
  snap_token?: string | null;
  redirect_url?: string | null;
  payment_expiry?: string | null;
  pg_fee?: number | string;
  net_amount?: number | string;
  created_at: string;
}

export interface UpdateTransactionRequest {
  code?: string | null;
  reference_code?: string | null;
  metadata?: string | null;
  type?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  payment_method?: string | null;
  status?: string | null;
  snap_token?: string | null;
  redirect_url?: string | null;
  payment_expiry?: string | null;
  pg_fee?: number | string | null;
  net_amount?: number | string | null;
}