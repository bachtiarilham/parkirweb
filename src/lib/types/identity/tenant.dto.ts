export interface Tenant {
  tenant_id: number;
  tenant_code: string;
  tenant_name: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  package_active: string;
  status: string;
  created_at: string | null;
  revoked_at: string | null;
  expired_at: string | null;
  updated_at: string | null;
  platform_commission_rate: number | string | null;
  tax_rate: number | string | null;
  tenant_commission_rate: number | string | null;
}

export interface CreateTenantRequest {
  code?: string | null;
  name: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  package_active: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'REVOKED' | string;
  platform_commission_rate?: number | string | null;
  tenant_commission_rate: number | string | null;
  tax_rate?: number | string | null;
  created_at?: string | null;
  expired_at?: string | null;
  updated_at?: string | null;
  revoked_at?: string | null;
}

export interface UpdateTenantRequest {
  tenant_code?: string | null;
  tenant_name?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  package_active?: string | null;
  status?: string | null;
  platform_commission_rate?: number | string | null;
  tax_rate?: number | string | null;
  tenant_commission_rate?: number | string | null;
  expired_at?: string | null;
  revoked_at?: string | null;
}