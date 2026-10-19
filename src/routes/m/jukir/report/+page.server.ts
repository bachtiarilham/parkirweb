import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import type { PageServerLoad } from './$types.js';
import { ACCESS_TOKEN_COOKIE } from '../../../../hooks.server.ts';

export const load: PageServerLoad = async ({ fetch, parent, cookies }) => {
	const { user } = await parent();
	const token = cookies.get(ACCESS_TOKEN_COOKIE) || null;

	try {
		const rawSessions = await parkingSessionService.getAll(token, undefined, { fetch });
		const sessions = Array.isArray(rawSessions) ? rawSessions : [];

		const totalTransactions = sessions.length;
		const totalAmount = sessions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
		const parkingCount = sessions.filter((s) => !s.payment_method || s.payment_method === 'CASH').length;
		const transferCount = sessions.filter((s) => s.payment_method === 'QRIS' || s.payment_method === 'TRANSFER').length;
		const topUpCount = 0;

		return {
			user,
			totalTransactions,
			totalAmount,
			parkingCount,
			transferCount,
			topUpCount,
			sessions
		};
	} catch (e: any) {
		return {
			user,
			totalTransactions: 0,
			totalAmount: 0,
			parkingCount: 0,
			transferCount: 0,
			topUpCount: 0,
			sessions: []
		};
	}
};
