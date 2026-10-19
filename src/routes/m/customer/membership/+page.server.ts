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
