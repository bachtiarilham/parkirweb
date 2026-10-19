export interface ParkSlotsInventory {
  id: number;
  branch_id: number;
  vehicle_type: string;
  date: string;
  total_slots: number;
  total_reserved: number;
  version: number;
}

export interface CreateSlotsInventoryRequest {
  branch_id: number;
  vehicle_type: string;
  date: string;
  total_slots: number;
  total_reserved?: number | null;
  version?: number | null;
}

export interface UpdateSlotsInventoryRequest {
  branch_id?: number | null;
  vehicle_type?: string | null;
  date?: string | null;
  total_slots?: number | null;
  total_reserved?: number | null;
  version?: number | null;
}