export interface GateDashboardData {
  identity_data: GateIdentity[];
  financial_data: GateFinancialData;
  parking_data: GateParkingData;
}

// ================= Identity Data =================

export interface GateIdentity {
  branch_id: number;
  branch_code: string;
  branch_name: string;
  gate_id: number;
  gate_code: string;
  gate_name: string;
  gate_type: 'IN' | 'OUT' | string;
  gate_status: 'ONLINE' | 'OFFLINE' | string;
  hardware_ip: string;
}

// ================= Financial Data =================

export interface GateFinancialData {
  shift_id: number;
  cash_collected_today: string;
  cashless_collected_today: string;
  total_revenue_this_shift: string;
}

// ================= Parking Data =================

export interface GateParkingData {
  branch_occupancy: BranchOccupancy;
  branch_traffic_flow: BranchTrafficFlow;
  active_shift: ActiveShift[];
  gate_alarm_alert: GateAlarmAlert[];
}

export interface BranchOccupancy {
  total_capacity: number;
  currently_occupied: number;
  available_slots: number;
  occupancy_percentage: number;
  car_total: number;
  car_occupied: number;
  car_available: number;
  moto_total: number;
  moto_occupied: number;
  moto_available: number;
}

export interface BranchTrafficFlow {
  total_in_today: number;
  total_out_today: number;
  overnight_stay_count: number;
}

export interface ActiveShift {
  shift_id: number;
  shift_code: string;
  status: 'OPEN' | 'CLOSED' | string;
  assigned_officer_id: number;
  assigned_officer_name: string;
  assigned_officer_nik: string;
  start_time: string;
  cash_float_start: string;
}

// Fallback interface untuk data alarm/alert jika ada isinya
export interface GateAlarmAlert {
  alert_id?: number | string;
  gate_id?: number;
  message?: string;
  created_at?: string;
  [key: string]: unknown;
}