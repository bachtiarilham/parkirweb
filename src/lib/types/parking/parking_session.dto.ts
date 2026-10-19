export interface ParkingSession {
  id: number;
  code: string;
  tenant_id: number;
  branch_id: number;
  gate_in_id?: number | null;
  gate_out_id?: number | null;
  officer_user_id: number;
  plate_number: string;
  vehicle_type: string;
  check_in_time: string;
  check_out_time?: string | null;
  duration_minutes: number | null;
  amount: number | string;
  status: string;
  payment_order_id?: string | null;
  metadata?: string | null;
}

export interface CreateParkingSessionRequest {
  code?: string | null;
  tenant_id: number;
  branch_id: number;
  gate_in_id?: number | null;
  gate_out_id?: number | null;
  officer_user_id: number;
  plate_number: string;
  vehicle_type: string;
  check_in_time?: string | null;
  status?: 'ACTIVE' | 'PENDING' | 'PAID' | 'COMPLETED' | string | null;
  amount?: number | string;
  payment_method?: string | null;
  payment_order_id?: string | null;
  metadata?: unknown | null;
}

export interface UpdateParkingSessionRequest {
  id?: number | null;
  session_Id?: string | null;
  session_code?: string | null;
  gate_in_id?: number | null;
  gate_out_id?: number | null;
  officer_user_id?: number | null;
  plate_number?: string | null;
  vehicle_type?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  duration_minutes?: number | null;
  amount?: number | string | null;
  status?: 'ACTIVE' | 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | string | null;
  payment_order_id?: string | null;
  metadata?: unknown | null;
}