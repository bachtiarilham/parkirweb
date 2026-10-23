import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { transactionsService } from '$lib/server/services/financial/transactions.service.js';
import { getAuthTokens, getUserContext } from '$lib/utils/getCookies.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ fetch, parent, cookies }) => {
	const { user, token: layoutToken } = await parent();
	const { accessToken } = getAuthTokens(cookies);
	const userContext = getUserContext(cookies);
	const token = layoutToken || accessToken || null;

	const currentUser = user || (userContext ? {
		id: String(userContext.userId ?? ''),
		user_id: userContext.userId,
		name: userContext.fullName,
		full_name: userContext.fullName,
		email: userContext.email,
		role_code: userContext.roleCode,
		role: userContext.roleCode,
		tenantId: userContext.tenantId ? String(userContext.tenantId) : null,
		tenantCode: userContext.tenantCode,
		branchId: userContext.branchId ? String(userContext.branchId) : null,
		branchCode: userContext.branchCode
	} : null);

	try {
		const branchId = currentUser?.branchId ? Number(currentUser.branchId) : undefined;
		const queryParams: Record<string, any> = { limit: 100 };
		if (branchId) queryParams.branch_id = branchId;

		const [rawSessions, rawPayTx] = await Promise.all([
			parkingSessionService.getAll(token, queryParams, { fetch }).catch((err) => {
				console.warn('[History load sessions error]:', err?.message || err);
				return [];
			}),
			transactionsService.getAll(token, { limit: 100 }, { fetch }).catch((err) => {
				console.warn('[History load payTx error]:', err?.message || err);
				return [];
			})
		]);

		const sessionsList = (Array.isArray(rawSessions) ? rawSessions : []) as any[];
		const payTxList = (Array.isArray(rawPayTx) ? rawPayTx : []) as any[];

		// Gabungkan transaksi parkir & transaksi pay-transactions dengan unique key anti-collision
		const combined = [
			...sessionsList.map((s, idx) => ({
				...s,
				unique_id: `park_${s.id || s.code || idx}`,
				id: s.id,
				code: s.code,
				plate_number: s.plate_number || 'KENDARAAN',
				vehicle_type: s.vehicle_type || 'MOTOR',
				amount: Number(s.amount || 0),
				status: s.status || 'ACTIVE',
				check_in_time: s.check_in_time || '',
				is_membership: false,
				item_type: 'PARKING'
			})),
			...payTxList.map((tx, idx) => ({
				...tx,
				unique_id: `tx_${tx.id || tx.transaction_code || idx}`,
				id: tx.id || tx.transaction_code,
				code: tx.transaction_code,
				plate_number: tx.plate_number || tx.description || ('TRX-' + (tx.id || idx)),
				vehicle_type: tx.type || 'PAYMENT',
				amount: Number(tx.amount || 0),
				status: tx.status || 'COMPLETED',
				check_in_time: tx.created_at || tx.payment_time || '',
				is_membership: (tx.type || '').toUpperCase().includes('MEMBER'),
				item_type: 'PAYMENT'
			}))
		];

		// Urutkan transaksi dari yang paling baru
		combined.sort((a, b) => {
			const timeA = a.check_in_time ? new Date(a.check_in_time).getTime() : 0;
			const timeB = b.check_in_time ? new Date(b.check_in_time).getTime() : 0;
			return timeB - timeA;
		});

		return {
			user: currentUser,
			sessions: combined
		};
	} catch (e: any) {
		console.error('[m/history/+page.server.ts] Fatal Load Error:', e);
		return {
			user: currentUser,
			sessions: []
		};
	}
};
