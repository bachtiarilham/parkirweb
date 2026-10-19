export interface Gate {
  gate_id: number;
  branch_id: number;
  tenant_id: number;
  gate_code: string;
  gate_name: string;
  gate_type: string;
  status?: string | null;
  hardware_ip: string;
  created_at: string | null;
  revoked_at: string | null;
  updated_at: string | null;
}

export interface CreateGateRequest {
  branch_id: number;
  tenant_id: number;
  gate_name: string;
  gate_type: string;
  status?: string | null;
  hardware_ip: string;
}

export interface UpdateGateRequest {
  branch_id?: number | null;
  tenant_id?: number | null;
  gate_code?: string | null;
  gate_name?: string | null;
  gate_type?: string | null;
  status?: string | null;
  hardware_ip?: string | null;
}