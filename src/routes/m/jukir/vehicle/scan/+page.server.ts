import { fail, type Actions } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/api/endpoints.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return { user };
};

export const actions: Actions = {
	ocr: async ({ request, fetch }) => {
		try {
			const incomingFormData = await request.formData();
			const file = (incomingFormData.get('image') || incomingFormData.get('file')) as File | Blob | null;

			if (!file || (file instanceof File && file.size === 0)) {
				return fail(400, {
					success: false,
					message: "File gambar tidak ditemukan. Gunakan form-data dengan key 'image' atau 'file'"
				});
			}

			const outboundFormData = new FormData();
			const filename = (file instanceof File && file.name) ? file.name : 'camera_capture.jpg';
			outboundFormData.append('image', file, filename);
			outboundFormData.append('file', file, filename);

			// Panggilan kanonikal 1:1 ke Go backend: /api/v1/ocr/license-plate
			const result = await apiClient.raw<any>(API_ENDPOINTS.OCR.LICENSE_PLATE, {
				method: 'POST',
				body: outboundFormData,
				fetch
			});

			const payload = result?.data || result;
			const plateNumber = (payload?.plate_number || payload?.plateNumber || payload?.plate || '').trim().toUpperCase();
			const confidence = Number(payload?.confidence ?? 0);
			const processingTimeMs = Number(payload?.processing_time_ms ?? payload?.processingTimeMs ?? 0);

			return {
				success: true,
				plate_number: plateNumber,
				confidence,
				processing_time_ms: processingTimeMs,
				data: payload
			};
		} catch (err: any) {
			console.error('[Action OCR error]:', err);
			return fail(err.status || 500, {
				success: false,
				message: err.message || 'Gagal memproses gambar OCR ke server'
			});
		}
	}
};
