import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { transactionsService } from '$lib/server/services/financial/transactions.service.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	if (!user) {
		return {
			user: null,
			sessions: []
		};
	}

	try {
		const [rawSessions, rawPayTx] = await Promise.all([
			parkingSessionService.getAll({ fetch }).catch(() => []),
			transactionsService.getAll({ fetch }).catch(() => [])
		]);

		const sessions = (Array.isArray(rawSessions) ? rawSessions : []) as any[];
		const payTx = (Array.isArray(rawPayTx) ? rawPayTx : []) as any[];

		// Gabungkan transaksi parkir & transaksi pay-transactions
		const combined = [
			...sessions,
			...payTx.map((tx) => ({
				id: tx.id || tx.transaction_code,
				plate_number: tx.plate_number || tx.description || 'TRX-' + (tx.id || ''),
				vehicle_type: tx.type || 'PAYMENT',
				amount: tx.amount,
				status: tx.status || 'COMPLETED',
				check_in_time: tx.created_at || tx.payment_time,
				is_membership: (tx.type || '').toUpperCase().includes('MEMBER')
			}))
		];

		return {
			user,
			sessions: combined
		};
	} catch (e: any) {
		return {
			user,
			sessions: []
		};
	}
};
