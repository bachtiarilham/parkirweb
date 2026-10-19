import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
	const { user } = await parent();
	const ticketId = params.id;

	let session: ParkingSession | null = null;
	if (user) {
		try {
			const rawSessions = await parkingSessionService.getAll({ fetch });
			const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

			session =
				sessions.find(
					(s) =>
						(s.code && s.code.toLowerCase() === ticketId.toLowerCase()) ||
						String(s.id) === ticketId
				) || null;
		} catch (e) {
			console.warn('Could not fetch ticket session:', e);
		}
	}

	return {
		user,
		ticketId,
		session
	};
};
