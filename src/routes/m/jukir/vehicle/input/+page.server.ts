import { fail, type Actions } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/api/endpoints.js';
import { tariffService } from '$lib/server/services/parking/tariff.service.js';
import { getUserContext, getAuthTokens } from '$lib/utils/getCookies.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent, url, fetch }) => {
	const { user, token } = await parent();
	const plateNumber = url.searchParams.get('plateNumber') || '';

	let tariffs: any[] = [];
	try {
		const res = await tariffService.getAll(
			token,
			{
				tenant_id: user?.tenantId,
				branch_id: user?.branchId,
				limit: 50
			},
			{ fetch }
		);
		if (Array.isArray(res)) {
			tariffs = res;
		}
	} catch (err) {
		console.warn('[Load Tariffs Warning]:', err);
		tariffs = [];
	}

	return {
		user,
		plateNumber,
		tariffs
	};
};

export const actions: Actions = {
	checkin: async ({ request, fetch, cookies }) => {
		try {
			const userContext = getUserContext(cookies);
			const { accessToken } = getAuthTokens(cookies);
			const contentType = request.headers.get('content-type') || '';

			let plateNumber = '';
			let vehicleType = 'MOTOR';
			let tenantId = userContext?.tenantId || 1;
			let branchId = userContext?.branchId || 1;
			let officerUserId = userContext?.userId || 1;
			let idempotencyKey = request.headers.get('x-idempotency-key') || '';
			let gateInId: number | null = null;
			let amount: number | undefined = undefined;
			let paymentMethod: string | undefined = undefined;

			if (contentType.includes('application/json')) {
				const body = await request.json();
				plateNumber = String(body.plate_number || '').trim().toUpperCase();
				vehicleType = String(body.vehicle_type || 'MOTOR');
				if (body.tenant_id) tenantId = Number(body.tenant_id);
				if (body.branch_id) branchId = Number(body.branch_id);
				if (body.officer_user_id) officerUserId = Number(body.officer_user_id);
				if (body.amount !== undefined && body.amount !== null && body.amount !== '') {
					amount = Number(body.amount);
				}
				if (body.payment_method) paymentMethod = String(body.payment_method);
				if (body.gate_in_id) gateInId = Number(body.gate_in_id);
				else if (body.gate_id) gateInId = Number(body.gate_id);

				if (!idempotencyKey && body.idempotency_key) {
					idempotencyKey = String(body.idempotency_key);
				}
			} else {
				const formData = await request.formData();
				plateNumber = String(formData.get('plate_number') || '').trim().toUpperCase();
				vehicleType = String(formData.get('vehicle_type') || 'MOTOR');
				if (formData.get('tenant_id')) tenantId = Number(formData.get('tenant_id'));
				if (formData.get('branch_id')) branchId = Number(formData.get('branch_id'));
				if (formData.get('officer_user_id')) officerUserId = Number(formData.get('officer_user_id'));
				if (formData.get('amount')) amount = Number(formData.get('amount'));
				if (formData.get('payment_method')) paymentMethod = String(formData.get('payment_method'));
				if (formData.get('gate_in_id')) gateInId = Number(formData.get('gate_in_id'));
				else if (formData.get('gate_id')) gateInId = Number(formData.get('gate_id'));

				if (!idempotencyKey && formData.get('idempotency_key')) {
					idempotencyKey = String(formData.get('idempotency_key'));
				}
			}

			if (!plateNumber) {
				return fail(400, {
					success: false,
					message: 'Nomor polisi kendaraan wajib diisi'
				});
			}

      // Map vehicle type to canonical server enum (BUS, TRUCK, MOTORCYCLE, CAR)
      const upperType = (vehicleType || '').trim().toUpperCase();
      let canonicalType = 'MOTORCYCLE'; // Default fallback

      if (upperType === 'MOBIL' || upperType === 'CAR') {
        canonicalType = 'CAR';
      } else if (upperType === 'TRUK' || upperType === 'TRUCK') {
        canonicalType = 'TRUCK';
      } else if (upperType === 'BUS') {
        canonicalType = 'BUS';
      } else if (upperType === 'MOTOR' || upperType === 'MOTORCYCLE' || upperType === 'SEPEDA MOTOR') {
        canonicalType = 'MOTORCYCLE';
      }

			const headers: Record<string, string> = {};
			if (idempotencyKey) {
				headers['X-Idempotency-Key'] = idempotencyKey;
			}

			const payload: Record<string, any> = {
				tenant_id: tenantId,
				branch_id: branchId,
				officer_user_id: officerUserId,
				plate_number: plateNumber,
				vehicle_type: canonicalType
			};
			if (gateInId) payload.gate_in_id = gateInId;
			if (amount !== undefined && !isNaN(amount)) payload.amount = amount;
			if (paymentMethod) payload.payment_method = paymentMethod;

			const response = await apiClient.raw<any>(
				API_ENDPOINTS.PARKING.SESSIONS.CHECKIN,
				{
					method: 'POST',
					body: JSON.stringify(payload),
					fetch,
					headers,
					token: accessToken
				}
			);

			return {
				success: true,
				data: response?.data || response
			};
		} catch (err: any) {
			console.error('[Action Checkin Error]:', err);
			const message =
				err.message ||
				(typeof err.data === 'string' ? err.data : err.data?.message) ||
				'Gagal memulai sesi parkir';
			return fail(err.status || 500, {
				success: false,
				message
			});
		}
	}
};
