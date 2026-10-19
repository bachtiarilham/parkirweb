import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { ParkingSession } from '$lib/types/parking/parking_session.dto.js';
import { ACCESS_TOKEN_COOKIE } from '../../../../hooks.server.ts';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;
	const ticketParam = url.searchParams.get('ticket') || '';

	try {
		const rawSessions = await parkingSessionService.getAll(token, undefined, { fetch });
		const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as ParkingSession[];

		const activeSessions = sessions.filter(
			(s) => (s.status || '').toUpperCase() === 'ACTIVE' || !s.check_out_time
		);

		let selectedSession: ParkingSession | null = null;
		if (ticketParam) {
			selectedSession =
				activeSessions.find(
					(s) =>
						(s.code && s.code.toLowerCase() === ticketParam.toLowerCase()) ||
						String(s.id) === ticketParam ||
						(s.plate_number && s.plate_number.toLowerCase() === ticketParam.toLowerCase())
				) || null;
		}

		return {
			activeSessions,
			selectedSession,
			ticketParam
		};
	} catch (err: any) {
		console.error('[m/jukir/checkout load error]:', err);
		return {
			activeSessions: [] as ParkingSession[],
			selectedSession: null,
			ticketParam,
			error: err.message
		};
	}
};

export const actions: Actions = {
	checkout: async ({ request, fetch, cookies }) => {
		const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;
		const formData = await request.formData();
		const sessionId = formData.get('sessionId')?.toString();
		const paymentMethod = formData.get('paymentMethod')?.toString() || 'CASH';
		const amount = formData.get('amount')?.toString() || '0';

		if (!sessionId) {
			return fail(400, { message: 'ID Sesi Parkir tidak ditemukan' });
		}

		try {
			const updatePayload = {
				id: Number(sessionId),
				status: 'COMPLETED',
				check_out_time: new Date().toISOString(),
				amount: Number(amount)
			};

			const result = await parkingSessionService.update(Number(sessionId), updatePayload, token, { fetch });

			return {
				success: true,
				session: result,
				paymentMethod
			};
		} catch (err: any) {
			console.error('[m/jukir/checkout action error]:', err);
			return fail(500, { message: err.message || 'Gagal menyelesaikan sesi parkir' });
		}
	}
};
