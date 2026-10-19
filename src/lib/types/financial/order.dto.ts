export interface PayOrder {
  id: number;
  payment_order_code: string;
  trx_code?: string | null;
  buyer_account_id?: number | null;
  seller_account_id: number;
  amount: number | string;
  currency: string;
  status: string;
  ledger_updated: boolean;
  reference_code?: string | null;
  created_at: string;
  updated_at: string;
  tax_rate: number | string;
  tax_amount: number | string;
  platform_commission_rate: number | string;
  platform_share_amount: number | string;
  tenant_commission_rate: number | string;
  tenant_share_amount: number | string;
  officer_commission_rate: number | string;
  officer_share_amount: number | string;
  officer_user_id?: number | null;
}

export interface CreateOrderRequest {
  payment_order_code?: string;
  trx_code?: string | null;
  buyer_account_id?: number | null;
  seller_account_id: number;
  amount: number | string;
  currency?: string;
  status?: string;
  ledger_updated?: boolean;
  reference_code?: string | null;
  tax_rate: number | string;
  tax_amount: number | string;
  platform_commission_rate: number | string;
  platform_share_amount: number | string;
  tenant_commission_rate: number | string;
  tenant_share_amount: number | string;
  officer_commission_rate: number | string;
  officer_share_amount: number | string;
  officer_user_id?: number | null;
  created_at: string;
}

export interface UpdateOrderRequest {
  payment_order_code?: string | null;
  trx_code?: string | null;
  buyer_account_id?: number | null;
  seller_account_id?: number | null;
  amount?: number | string | null;
  currency?: string | null;
  status?: string | null;
  ledger_updated?: boolean | null;
  reference_code?: string | null;
  tax_rate?: number | string;
  tax_amount?: number | string;
  platform_commission_rate?: number | string | null;
  platform_share_amount?: number | string | null;
  tenant_commission_rate?: number | string | null;
  tenant_share_amount?: number | string | null;
  officer_commission_rate?: number | string | null;
  officer_share_amount?: number | string | null;
  officer_user_id?: number | null;
  updated_at: string;
}