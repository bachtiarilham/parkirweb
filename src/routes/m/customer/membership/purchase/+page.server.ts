import { fail, type Actions } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/api/endpoints.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return { user };
};

export const actions: Actions = {
	purchase: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const planId = formData.get('plan_id');
			const plateNumber = formData.get('plate_number');
			const vehicleType = formData.get('vehicle_type');

			if (!plateNumber) {
				return fail(400, { success: false, message: 'Nomor polisi kendaraan wajib diisi' });
			}

			const payload = {
				plan_id: Number(planId || 1),
				license_plates: String(plateNumber).trim().toUpperCase(),
				rfid_card_no: String(plateNumber).trim().toUpperCase(),
				vehicle_type: vehicleType ? String(vehicleType) : 'MOTOR'
			};

			const response = await apiClient.raw<any>(
				API_ENDPOINTS.MEMBERSHIP.RIDER_CONTRACTS.BASE,
				{
					method: 'POST',
					body: JSON.stringify(payload),
					fetch
				}
			);

			return {
				success: true,
				data: response?.data || response
			};
		} catch (err: any) {
			console.error('[Action Purchase Error]:', err);
			return fail(err.status || 500, {
				success: false,
				message: err.message || 'Gagal memproses pendaftaran membership'
			});
		}
	}
};
