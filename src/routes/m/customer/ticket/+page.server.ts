import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	let activeSession: ParkingSession | null = null;
	if (user) {
		try {
			const rawSessions = await parkingSessionService.getAll({ fetch });
			const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

			activeSession =
				sessions.find(
					(s) => (s.status || '').toUpperCase() === 'ACTIVE' || !s.check_out_time
				) || null;
		} catch (e) {
			console.warn('Could not fetch active session for ticket:', e);
		}
	}

	return {
		user,
		activeSession
	};
};
