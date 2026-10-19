import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { riderContractService } from '$lib/server/services/membership/rider_contract.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';
import type { MemberRiderContract } from '$lib/types/membership/rider_contract.dto.js';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	let activeSession: ParkingSession | null = null;
	let activeContract: MemberRiderContract | null = null;

	try {
		const rawSessions = await parkingSessionService.getAll(undefined, undefined, { fetch });
		const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

		// Cari sesi aktif yang cocok dengan user atau plat nomor user
		activeSession =
			sessions.find(
				(s) => (s.status || '').toUpperCase() === 'ACTIVE' || !s.check_out_time
			) || null;
	} catch (e) {
		console.warn('Could not fetch active session for customer:', e);
	}

	try {
		const rawContracts = await riderContractService.getAll(undefined, undefined, { fetch });
		const contracts = (Array.isArray(rawContracts) ? rawContracts : []) as MemberRiderContract[];

		activeContract =
			contracts.find((c) => (c.status || '').toUpperCase() === 'ACTIVE') || null;
	} catch (e) {
		console.warn('Could not fetch contracts for customer:', e);
	}

	return {
		user,
		activeSession,
		activeContract
	};
};
