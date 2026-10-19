export interface Ad {
  id: string;
  tenant_id: string;
  title: string;
  image_url?: string | null;
  target_url?: string | null;
  status: string;
  created_at: string;
}

export interface AdClickRaw {
  id: number;
  ad_id: string;
  user_id?: number | null;
  click_timestamp: string;
  ip_address: string;
  country: string;
  branch_id?: number | null;
}

export interface AdClickAggregation {
  id: number;
  ad_id: string;
  click_minute: string;
  filter_id: string;
  click_count: number;
}

export interface PopularAd {
  id: number;
  window_size_minutes: number;
  update_time_minute: string;
  most_clicked_ads: string; // JSON string
}