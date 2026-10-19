import { parkingSessionService } from '$lib/server/services/parking/parking_session.service.js';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url, fetch, parent }) => {
	const { user } = await parent();
	const id = params.id;
	const snapToken = url.searchParams.get('snapToken') || '';
	const queryAmount = Number(url.searchParams.get('amount')) || 2000;

	let session = null;
	try {
		if (id && !id.startsWith('TKT-')) {
			session = await parkingSessionService.getById(id, { fetch });
		}
	} catch (e) {
		console.warn('Session detail fetch error:', e);
	}

	const amount = session?.amount || queryAmount;
	const plateNumber = session?.plate_number || url.searchParams.get('plateNumber') || 'B 1234 XYZ';
	const vehicleType = session?.vehicle_type || 'MOTOR';

	return {
		user,
		id,
		snapToken,
		amount,
		plateNumber,
		vehicleType,
		session
	};
};

export const actions: Actions = {
	payCash: async ({ params, request, fetch }) => {
		const id = params.id;
		const formData = await request.formData();
		const amount = Number(formData.get('amount')) || 2000;

		try {
			if (id && !id.startsWith('TKT-')) {
				await parkingSessionService.update(
					id,
					{
						status: 'COMPLETED',
						payment_method: 'CASH',
						amount: amount,
						check_out_time: new Date().toISOString()
					},
					undefined,
					{ fetch }
				);
			}

			return { success: true };
		} catch (err: any) {
			console.error('payCash error:', err);
			return fail(500, { message: err.message || 'Gagal memproses pembayaran tunai' });
		}
	}
};
