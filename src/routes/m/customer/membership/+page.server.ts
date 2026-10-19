import { riderPlanService } from '$lib/server/services/membership/rider_plan.service.js';
import { riderContractService } from '$lib/server/services/membership/rider_contract.service.js';
import type { PageServerLoad } from './$types.js';
import type { MemberRiderPlan } from '$lib/types/membership/rider_plan.dto.js';
import type { MemberRiderContract } from '$lib/types/membership/rider_contract.dto.js';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	let plans: MemberRiderPlan[] = [];
	let activeContract: MemberRiderContract | null = null;

	try {
		const rawPlans = await riderPlanService.getAll(undefined, undefined, { fetch });
		plans = Array.isArray(rawPlans) ? rawPlans : [];
	} catch (e) {
		console.warn('Could not fetch rider plans:', e);
		// Fallback mock plans jika database belum terisi paket
		plans = [
			{
				member_rider_plan_id: 1,
				tenant_id: 1,
				member_rider_plan_code: 'PLAN-DAILY-MTR',
				member_rider_plan_name: 'Harian Motor Hemat',
				duration_days: 1,
				vehicle_limit: 1,
				member_rider_plan_price: 5000,
				is_active: true
			},
			{
				member_rider_plan_id: 2,
				tenant_id: 1,
				member_rider_plan_code: 'PLAN-MONTHLY-MTR',
				member_rider_plan_name: 'Bulanan Motor Unlimited',
				duration_days: 30,
				vehicle_limit: 1,
				member_rider_plan_price: 50000,
				is_active: true
			},
			{
				member_rider_plan_id: 3,
				tenant_id: 1,
				member_rider_plan_code: 'PLAN-MONTHLY-CAR',
				member_rider_plan_name: 'Bulanan Mobil Premium',
				duration_days: 30,
				vehicle_limit: 1,
				member_rider_plan_price: 150000,
				is_active: true
			}
		];
	}

	try {
		const rawContracts = await riderContractService.getAll(undefined, undefined, { fetch });
		const contracts = Array.isArray(rawContracts) ? rawContracts : [];
		activeContract = contracts.find((c) => (c.status || '').toUpperCase() === 'ACTIVE') || null;
	} catch (e) {
		console.warn('Could not fetch rider contracts:', e);
	}

	return {
		user,
		plans,
		activeContract
	};
};

import { fail, type Actions } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/api/endpoints.js';

export const actions: Actions = {
	subscribe: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const planId = formData.get('plan_id');
			const licensePlate = formData.get('license_plate');

			if (!licensePlate) {
				return fail(400, { success: false, message: 'Nomor plat kendaraan wajib diisi' });
			}

			const payload = {
				plan_id: Number(planId || 1),
				rfid_card_no: String(licensePlate).trim().toUpperCase(),
				license_plates: String(licensePlate).trim().toUpperCase()
			};

			const response = await apiClient.raw<any>(
				API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.BASE,
				{
					method: 'POST',
					body: JSON.stringify(payload),
					fetch
				}
			);

			return {
				success: true,
				data: response?.data || response
			};
		} catch (err: any) {
			console.error('[Action Subscribe Error]:', err);
			return fail(err.status || 500, {
				success: false,
				message: err.message || 'Gagal memproses langganan membership'
			});
		}
	}
};

