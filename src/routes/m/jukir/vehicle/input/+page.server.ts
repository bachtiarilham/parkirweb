import { fail, type Actions } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/api/endpoints.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();
	const plateNumber = url.searchParams.get('plateNumber') || '';

	return {
		user,
		plateNumber
	};
};

export const actions: Actions = {
	checkin: async ({ request, fetch }) => {
		try {
			const contentType = request.headers.get('content-type') || '';
			let plateNumber = '';
			let vehicleType = 'MOTOR';
			let branchId = 1;
			let idempotencyKey = request.headers.get('x-idempotency-key') || '';
			let gateId: number | undefined = undefined;

			if (contentType.includes('application/json')) {
				const body = await request.json();
				plateNumber = String(body.plate_number || '').trim().toUpperCase();
				vehicleType = String(body.vehicle_type || 'MOTOR');
				branchId = Number(body.branch_id || 1);
				if (!idempotencyKey && body.idempotency_key) {
					idempotencyKey = String(body.idempotency_key);
				}
				if (body.gate_id) gateId = Number(body.gate_id);
			} else {
				const formData = await request.formData();
				plateNumber = String(formData.get('plate_number') || '').trim().toUpperCase();
				vehicleType = String(formData.get('vehicle_type') || 'MOTOR');
				branchId = Number(formData.get('branch_id') || 1);
				if (!idempotencyKey && formData.get('idempotency_key')) {
					idempotencyKey = String(formData.get('idempotency_key'));
				}
				if (formData.get('gate_id')) gateId = Number(formData.get('gate_id'));
			}

			if (!plateNumber) {
				return fail(400, {
					success: false,
					message: 'Nomor polisi kendaraan wajib diisi'
				});
			}

			const headers: Record<string, string> = {};
			if (idempotencyKey) {
				headers['X-Idempotency-Key'] = idempotencyKey;
			}

			const payload: Record<string, any> = {
				plate_number: plateNumber,
				vehicle_type: vehicleType,
				branch_id: branchId
			};
			if (gateId) payload.gate_id = gateId;

			const response = await apiClient.raw<any>(
				API_ENDPOINTS.PARKING.SESSIONS.CHECKIN,
				{
					method: 'POST',
					body: JSON.stringify(payload),
					fetch,
					headers
				}
			);

			return {
				success: true,
				data: response?.data || response
			};
		} catch (err: any) {
			console.error('[Action Checkin Error]:', err);
			return fail(err.status || 500, {
				success: false,
				message: err.message || 'Gagal memulai sesi parkir'
			});
		}
	}
};
