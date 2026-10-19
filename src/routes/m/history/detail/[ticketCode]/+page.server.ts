import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { transactionsService } from '$lib/server/services/financial/transactions.service.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
	const { user } = await parent();
	const ticketCode = params.ticketCode;

	let session: any = null;
	try {
		if (ticketCode && !ticketCode.startsWith('TKT-')) {
			session = await parkingSessionService.getById(ticketCode, undefined, { fetch }).catch(() => null);
			if (!session) {
				const tx: any = await transactionsService.getById(ticketCode, undefined, { fetch }).catch(() => null);
				if (tx) {
					session = {
						id: tx.id,
						code: tx.transaction_code,
						plate_number: tx.plate_number || 'TRX-' + tx.id,
						vehicle_type: tx.type || 'PAYMENT',
						amount: tx.amount,
						status: tx.status || 'COMPLETED',
						payment_method: tx.payment_method || 'QRIS / Cash',
						check_in_time: tx.created_at || tx.payment_time,
						check_out_time: tx.updated_at
					};
				}
			}
		}
	} catch (e) {
		console.warn('Invoice session fetch error:', e);
	}

	return {
		user,
		ticketCode,
		session
	};
};
