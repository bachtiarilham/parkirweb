export type ZonaType = 'BLUECHIP' | 'NORMAL' | 'MURAH';

export interface Branch {
  branch_id: number;
  tenant_id: number;
  branch_code: string;
  branch_name: string;
  zona: ZonaType | string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  branch_type: string;
  status: string;
  created_at: string | null;
  revoked_at: string | null;
  updated_at: string | null;
  platform_commission_rate?: number | string | null;
  tax_rate?: number | string | null;
  officer_commission_rate: number | string | null;
  branch_commission_rate: number | string | null;
}

export interface CreateBranchRequest {
  tenant_id: number;
  branch_name: string;
  zona: ZonaType | string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  branch_type: string;
  status?: string | null;
  platform_commission_rate?: number | string | null;
  tax_rate?: number | string | null;
  officer_commission_rate?: number | string | null;
  branch_commission_rate: number | string | null;
}

export interface UpdateBranchRequest {
  tenant_id?: number | null;
  branch_name?: string | null;
  zona?: ZonaType | string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  branch_type?: string | null;
  status?: string | null;
  platform_commission_rate?: number | string | null;
  tax_rate?: number | string | null;
  officer_commission_rate?: number | string | null;
  branch_commission_rate?: number | string | null;
}