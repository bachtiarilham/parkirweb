export interface ParkingTariff {
  tariff_id: number;
  tariff_code: string;
  tariff_version: number;
  tenant_id: number;
  branch_id: number;
  vehicle_type: string;
  base_fare: number | string;
  hourly_fare: number | string;
  grace_period_minutes: number;
  rules_config?: string;
  is_active: boolean;
}

export interface CreateTariffRequest {
  tariff_code?: string | null;
  tenant_id: number;
  branch_id: number;
  vehicle_type: string;
  base_fare: number | string;
  hourly_fare: number | string;
  grace_period_minutes: number;
  rules_config?: unknown | null;
  is_active?: boolean | null;
}

export interface UpdateTariffRequest {
  tenant_id?: number | null;
  branch_id?: number | null;
  vehicle_type?: string | null;
  base_fare?: number | string | null;
  hourly_fare?: number | string | null;
  grace_period_minutes?: number | null;
  rules_config?: unknown | null;
  is_active?: boolean | null;
}