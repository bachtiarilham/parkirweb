export interface MemberTenantPlan {
  member_tenant_plan_id: number;
  member_tenant_plan_code: string;
  member_tenant_plan_name: string;
  price_per_month: number;
  duration_year: number;
  max_branches: number;
  max_gates: number;
  features?: unknown | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  revoked_at: string | null;
}

export interface CreateTenantPlanRequest {
  member_tenant_plan_code: string;
  member_tenant_plan_name: string;
  price_per_month: number;
  max_branches: number;
  max_gates: number;
  features?: unknown | null;
  is_active?: boolean;
}

export interface UpdateTenantPlanRequest {
  member_tenant_plan_name?: string | null;
  price_per_month?: number | null;
  max_branches?: number | null;
  max_gates?: number | null;
  features?: unknown | null;
  is_active?: boolean | null;
}

export interface TenantPlanResponse {
  member_tenant_plan_id: number;
  member_tenant_plan_code: string;
  member_tenant_plan_name: string;
  price_per_month: number;
  max_branches: number;
  max_gates: number;
  features?: unknown | null;
  is_active: boolean;
}