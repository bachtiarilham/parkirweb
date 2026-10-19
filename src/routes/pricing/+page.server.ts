import type { PageServerLoad } from "./$types.js";
import { riderPlanService } from "$lib/server/services/membership/rider_plan.service.js";

const ACCESS_TOKEN_COOKIE = "access_token";

const DEFAULT_PLANS = [
	{
		member_rider_plan_id: 1,
		member_rider_plan_code: "RIDER-MONTHLY-CAR",
		plan_rule_id: 2,
		tenant_id: 0,
		member_rider_plan_name: "Paket Bulanan Mobil",
		member_rider_plan_price: "250000",
		duration_days: 30,
		vehicle_limit: 1,
		is_active: true,
		rule: {
			id: 2,
			template_code: "TMPL-ALLDAY-247",
			template_name: "Template All-Day 24/7 Pass",
			plan_category: "PERSONAL",
			valid_days: '["ALL"]',
			valid_time_start: "00:00:00",
			valid_time_end: "23:59:59",
			overstay_action: "REGULAR_FARE",
			weekend_access: "ALLOWED",
			slot_type: "UNRESERVED_FLOATING",
			anti_passback: "STRICT",
			barrier_override_mode: "NORMAL_CHECK",
			allow_in_and_out_unlimited: true,
			max_registered_vehicles: 2,
			concurrency_limit: 1,
			quota_mode: "INDIVIDUAL",
			overflow_action: "NONE",
			account_type: "PERSONAL_PREPAID",
			billing_cycle: "PREPAID_ONETIME",
			validation_method: "NONE",
			voucher_mode: "NONE",
			alert_threshold_amount: "0",
			created_at: "2026-09-16T13:37:06+07:00",
			updated_at: "2026-09-16T13:37:06+07:00",
		},
		features: [
			{
				id: 4,
				plan_id: 1,
				feature_id: 2,
				feature_code: "FEAT_RESERVED_FIXED",
				feature_name: "Reserved Space Khusus Papan Nama",
				description:
					"Slot parkir khusus terdedikasi dengan papan nama/nomor di lokasi strategis dekat lobi utama atau lift.",
				category: "PARKING_SPACE",
				icon_name: "vip-crown-line",
				display_order: 1,
				is_highlighted: true,
			},
			{
				id: 5,
				plan_id: 1,
				feature_id: 3,
				feature_code: "FEAT_LPR_FAST_LANE",
				feature_name: "Fast Lane Automatic LPR Barrier",
				description:
					"Akses jalur cepat (fast lane) dengan verifikasi LPR otomatis tanpa perlu tap kartu atau kartu antri.",
				category: "GATE_ACCESS",
				icon_name: "speed-line",
				display_order: 2,
				is_highlighted: false,
			},
			{
				id: 6,
				plan_id: 1,
				feature_id: 4,
				feature_code: "FEAT_EMERGENCY_ASSIST",
				feature_name: "Gratis Bantuan Darurat Aki/Ban",
				description:
					"Layanan bantuan darurat gratis di area parkir jika terjadi kendala kendaraan seperti aki lemah atau ban bocor.",
				category: "SUPPORT",
				icon_name: "car-service-line",
				display_order: 3,
				is_highlighted: true,
			},
		],
	},
	{
		member_rider_plan_id: 2,
		member_rider_plan_code: "RIDER-MONTHLY-MOTOR",
		plan_rule_id: 2,
		tenant_id: 0,
		member_rider_plan_name: "Paket Bulanan Motor",
		member_rider_plan_price: "100000",
		duration_days: 30,
		vehicle_limit: 1,
		is_active: true,
		rule: {
			id: 2,
			template_code: "TMPL-ALLDAY-247",
			template_name: "Template All-Day 24/7 Pass",
			plan_category: "PERSONAL",
			valid_days: '["ALL"]',
			valid_time_start: "00:00:00",
			valid_time_end: "23:59:59",
			overstay_action: "REGULAR_FARE",
			weekend_access: "ALLOWED",
			slot_type: "UNRESERVED_FLOATING",
			anti_passback: "STRICT",
			barrier_override_mode: "NORMAL_CHECK",
			allow_in_and_out_unlimited: true,
			max_registered_vehicles: 2,
			concurrency_limit: 1,
			quota_mode: "INDIVIDUAL",
			overflow_action: "NONE",
			account_type: "PERSONAL_PREPAID",
			billing_cycle: "PREPAID_ONETIME",
			validation_method: "NONE",
			voucher_mode: "NONE",
			alert_threshold_amount: "0",
			created_at: "2026-09-16T13:37:06+07:00",
			updated_at: "2026-09-16T13:37:06+07:00",
		},
		features: [
			{
				id: 7,
				plan_id: 2,
				feature_id: 3,
				feature_code: "FEAT_LPR_FAST_LANE",
				feature_name: "Fast Lane Automatic LPR Barrier",
				description: "Verifikasi LPR otomatis jalur motor khusus rider langganan.",
				category: "GATE_ACCESS",
				icon_name: "speed-line",
				display_order: 1,
				is_highlighted: false,
			},
			{
				id: 8,
				plan_id: 2,
				feature_id: 4,
				feature_code: "FEAT_EMERGENCY_ASSIST",
				feature_name: "Bantuan Pompa Ban Gratis",
				description: "Layanan pompa angin gratis di pos kasir utama.",
				category: "SUPPORT",
				icon_name: "car-service-line",
				display_order: 2,
				is_highlighted: false,
			},
		],
	},
];

import { getUserContext } from "$lib/utils/getCookies.js";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;
	const user = getUserContext(cookies);
	const isLoggedIn = Boolean(token);

	try {
		const plans = await riderPlanService.getAll(token, undefined, { fetch });
		if (Array.isArray(plans) && plans.length > 0) {
			return {
				plans,
				isLoggedIn,
				user,
			};
		}
	} catch (err) {
		console.warn("[PricingPage] Gagal memuat plan dari backend, menggunakan data default:", err);
	}

	return {
		plans: DEFAULT_PLANS,
		isLoggedIn,
		user,
	};
};
