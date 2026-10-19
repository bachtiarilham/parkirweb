export interface Shift {
  id: number;
  code: string;
  version: number;
  user_id: number;
  branch_id: number;
  start_time: string;
  end_time?: string | null;
  cash_float_start: number;
  cash_collected: number;
  status: string;
}

export interface CreateShiftRequest {
  code?: string | null;
  user_id: number;
  branch_id: number;
  start_time?: string | null;
  cash_float_start?: number | null;
  cash_collected?: number | null;
  status?: 'OPEN' | 'CLOSED' | 'BALANCED' | 'UNBALANCED' | string | null;
}

export interface UpdateShiftRequest {
  user_id?: number | null;
  branch_id?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  cash_float_start?: number | null;
  cash_collected?: number | null;
  status?: 'OPEN' | 'CLOSED' | 'BALANCED' | 'UNBALANCED' | string | null;
}