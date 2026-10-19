export interface GateAlarm {
  id: number;
  code: string;
  gate_id: number;
  triggered_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  handling_officer_id?: number | null;
  latency_seconds?: number | null;
}

export interface CreateGateAlarmRequest {
  code?: string | null;
  gate_id: number;
  triggered_at?: string | null;
  handling_officer_id?: number | null;
}

export interface UpdateGateAlarmRequest {
  gate_id?: number | null;
  triggered_at?: string | null;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  handling_officer_id?: number | null;
  latency_seconds?: number | null;
}