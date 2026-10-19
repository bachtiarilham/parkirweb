export interface ParkReservation {
  id: number;
  code: string;
  user_id: number;
  branch_id: number;
  vehicle_type: string;
  start_date: string;
  end_date: string;
  status: string;
  payment_order_id: string | null;
  created_at: string | null;
}

export interface CreateReservationRequest {
  code?: string | null;
  user_id: number;
  branch_id: number;
  vehicle_type: string;
  start_date: string;
  end_date: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | string | null;
  payment_order_id?: string | null;
  created_at?: string | null;
}

export interface UpdateReservationRequest {
  user_id?: number | null;
  branch_id?: number | null;
  vehicle_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | string | null;
  payment_order_id?: string | null;
}