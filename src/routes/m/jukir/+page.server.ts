import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';
import { ACCESS_TOKEN_COOKIE } from '../../../hooks.server.ts';

export const load: PageServerLoad = async ({ fetch, parent, cookies }) => {
	const { user } = await parent();
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;

	try {
		const rawSessions = await parkingSessionService.getAll(token, undefined, { fetch });
		const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

		const activeSessions = sessions.filter(
			(s) => (s.status || '').toUpperCase() === 'ACTIVE' || !s.check_out_time
		);
		const completedToday = sessions.filter(
			(s) => (s.status || '').toUpperCase() === 'COMPLETED' || (s.status || '').toUpperCase() === 'PAID'
		);

		const motorCount = activeSessions.filter((s) => (s.vehicle_type || '').toUpperCase().includes('MOTOR')).length;
		const mobilCount = activeSessions.filter((s) => (s.vehicle_type || '').toUpperCase().includes('MOBIL')).length;

		const totalCashToday = completedToday.reduce((acc, curr) => {
			const amt = Number(curr.amount) || 0;
			return acc + amt;
		}, 0);

		return {
			user,
			activeSessions,
			completedToday,
			stats: {
				totalActive: activeSessions.length,
				motorCount,
				mobilCount,
				totalCompleted: completedToday.length,
				totalCashToday
			}
		};
	} catch (err: any) {
		console.error('[m/jukir/+page.server.ts] Error:', err);
		return {
			user,
			activeSessions: [] as ParkingSession[],
			completedToday: [] as ParkingSession[],
			stats: {
				totalActive: 0,
				motorCount: 0,
				mobilCount: 0,
				totalCompleted: 0,
				totalCashToday: 0
			},
			error: err.message
		};
	}
};
