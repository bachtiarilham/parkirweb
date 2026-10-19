export interface PromoTargetRules {
  allowed_vehicle_types: string[];
  allowed_payment_methods: string[];
  allowed_user_segments: string[];
  min_duration_minutes: number;
  max_usage_per_user: number;
}

export interface Promo {
  id: number;
  tenant_id: number;
  branch_id: number;
  code: string;
  description?: string | null;
  discount_type: 'PERCENT' | 'FLAT' | string;
  discount_value: number | string;
  max_discount: number | string;
  min_purchase: number | string;
  start_date: string;
  end_date: string;
  usage_limit: number;
  target_rules: string | null;
}

export interface CreatePromoRequest {
  tenant_id: number;
  branch_id: number;
  code: string;
  description?: string | null;
  discount_type: 'PERCENT' | 'FLAT' | 'FIXED' | string;
  discount_value: number | string;
  max_discount?: number | string | null;
  min_purchase?: number | string | null;
  start_date: string;
  end_date: string;
  usage_limit?: number | null;
  target_rules?: string | null;
}

export interface UpdatePromoRequest {
  tenant_id?: number | null;
  branch_id?: number | null;
  code?: string | null;
  description?: string | null;
  discount_type?: 'PERCENT' | 'FLAT' | 'FIXED' | string | null;
  discount_value?: number | string | null;
  max_discount?: number | string | null;
  min_purchase?: number | string | null;
  start_date?: string | null;
  end_date?: string | null;
  usage_limit?: number | null;
  target_rules?: string | null;
}