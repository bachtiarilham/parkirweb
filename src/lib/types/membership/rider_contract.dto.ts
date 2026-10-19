export interface MemberRiderContract {
  id: number;
  code: string;
  user_id?: number | null;
  plan_id: number;
  payment_order_code?: string | null;
  rfid_card_no: string;
  license_plates: unknown; // Representasi json.RawMessage
  status: string;
  started_at: string;
  expires_at: string;
  created_at: string;
}

export interface CreateRiderContractRequest {
  code?: string | null;
  user_id?: number | null;
  plan_id: number;
  payment_order_code?: string | null;
  rfid_card_no: string;
  license_plates: string;
  status?: string | null;
  started_at?: string | null;
  expires_at?: string | null;
}

export interface UpdateRiderContractRequest {
  code?: string | null;
  user_id?: number | null;
  plan_id?: number | null;
  payment_order_code?: string | null;
  rfid_card_no?: string | null;
  license_plates?: string | null;
  status?: string | null;
  started_at?: string | null;
  expires_at?: string | null;
}