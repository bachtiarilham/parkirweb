export interface TransactionPerDate {
  date: string;
  transaction_count: number;
  total_amount: number;
  motor_count: number;
  car_count: number;
  qris_count: number;
  cash_count: number;
}

export interface ReportSummary {
  total_transactions: number;
  total_amount: number;
  parking_count: number;
  transfer_count: number;
  top_up_count: number;
  period: string;
  transaction_per_date: TransactionPerDate[];
}

export interface TxDailyStat {
  date: string;
  transaction_count: number;
  total_amount: number;
  qris_count: number;
  cash_count: number;
}

export interface ParkingDailyStat {
  date: string;
  vehicle_type: string;
  session_count: number;
}

export interface TxSummary {
  total_transactions: number;
  total_amount: number;
  parking_count: number;
  transfer_count: number;
  top_up_count: number;
}