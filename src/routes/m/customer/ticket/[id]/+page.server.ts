import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';
import { ACCESS_TOKEN_COOKIE } from '../../../../../hooks.server.ts';

export const load: PageServerLoad = async ({ params, fetch, parent, cookies }) => {
	const { user } = await parent();
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;
	const ticketId = params.id;

	let session: ParkingSession | null = null;
	if (token) {
		try {
			const rawSessions = await parkingSessionService.getAll(token, undefined, { fetch });
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
