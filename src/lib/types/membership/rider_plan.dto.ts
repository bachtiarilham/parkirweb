export interface MemberRiderPlanFeature {
  id?: number;
  plan_id?: number;
  feature_id?: number;
  feature_code?: string;
  feature_name: string;
  description?: string;
  category?: string;
  icon_name?: string;
  display_order?: number;
  is_highlighted?: boolean;
}

export interface MemberRiderPlanRule {
  id?: number;
  template_code?: string;
  template_name?: string;
  plan_category?: string;
  valid_days?: string;
  valid_time_start?: string;
  valid_time_end?: string;
  overstay_action?: string;
  weekend_access?: string;
  slot_type?: string;
  anti_passback?: string;
  barrier_override_mode?: string;
  allow_in_and_out_unlimited?: boolean;
  max_registered_vehicles?: number;
  concurrency_limit?: number;
  quota_mode?: string;
  overflow_action?: string;
  account_type?: string;
  billing_cycle?: string;
  validation_method?: string;
  voucher_mode?: string;
  alert_threshold_amount?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MemberRiderPlan {
  member_rider_plan_id: number;
  member_rider_plan_code: string;
  plan_rule_id?: number;
  tenant_id: number;
  member_rider_plan_name: string;
  member_rider_plan_price: number | string;
  duration_days: number;
  vehicle_limit: number;
  is_active: boolean;
  features?: string | MemberRiderPlanFeature[] | null;
  rules_config?: string | null;
  rule?: MemberRiderPlanRule | null;
}

export interface CreateRiderPlanRequest {
  member_rider_plan_code: string;
  tenant_id: number;
  member_rider_plan_name: string;
  member_rider_plan_price: number | string;
  duration_days: number;
  vehicle_limit: number;
  is_active?: boolean;
}

export interface UpdateRiderPlanRequest {
  member_rider_plan_name?: string | null;
  member_rider_plan_price?: number | string | null;
  duration_days?: number | null;
  vehicle_limit?: number | null;
  is_active?: boolean | null;
}

export interface RiderPlanResponse {
  member_rider_plan_id: number;
  member_rider_plan_code: string;
  tenant_id: number;
  member_rider_plan_name: string;
  member_rider_plan_price: number | string;
  duration_days: number;
  vehicle_limit: number;
  is_active: boolean;
}