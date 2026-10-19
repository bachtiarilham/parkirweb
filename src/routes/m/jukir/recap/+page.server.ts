import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';
import { ACCESS_TOKEN_COOKIE } from '../../../../hooks.server.ts';

export const load: PageServerLoad = async ({ fetch, parent, cookies }) => {
	const { user } = await parent();
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;

	try {
		const rawSessions = await parkingSessionService.getAll(token, undefined, { fetch });
		const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

		const completedToday = sessions.filter(
			(s) => (s.status || '').toUpperCase() === 'COMPLETED' || (s.status || '').toUpperCase() === 'PAID'
		);

		let totalCash = 0;
		let totalQris = 0;
		let motorCount = 0;
		let mobilCount = 0;

		for (const s of completedToday) {
			const amt = Number(s.amount) || 0;
			totalCash += amt;
			const vType = (s.vehicle_type || '').toUpperCase();
			if (vType.includes('MOTOR')) motorCount++;
			else if (vType.includes('MOBIL')) mobilCount++;
		}

		return {
			user,
			completedToday,
			summary: {
				totalCount: completedToday.length,
				totalRevenue: totalCash,
				motorCount,
				mobilCount
			}
		};
	} catch (err: any) {
		console.error('[m/jukir/recap error]:', err);
		return {
			user,
			completedToday: [] as ParkingSession[],
			summary: {
				totalCount: 0,
				totalRevenue: 0,
				motorCount: 0,
				mobilCount: 0
			},
			error: err.message
		};
	}
};
