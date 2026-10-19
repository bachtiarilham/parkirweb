export interface OfficerPresence {
  id: number;
  code: string;
  branch_id: number;
  officer_user_id: number;
  shift_id: number;
  clock_in_at: string;
  clock_out_at?: string | null;
  device_heartbeats_count: number;
  status: string;
}

export interface CreateOfficerPresenceRequest {
  code?: string | null;
  branch_id: number;
  officer_user_id: number;
  shift_id: number;
  clock_in_at?: string | null;
  device_heartbeats_count?: number | null;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | string | null;
}

export interface UpdateOfficerPresenceRequest {
  branch_id?: number | null;
  officer_user_id?: number | null;
  shift_id?: number | null;
  clock_in_at?: string | null;
  clock_out_at?: string | null;
  device_heartbeats_count?: number | null;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'COMPLETED' | string | null;
}