import { json, type RequestHandler } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/server/api/endpoints.js';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
		const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : (cookies.get('access_token') || null);

		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data')) {
			return json(
				{
					success: false,
					code: 400,
					message: "Format request harus multipart/form-data dengan field 'file' atau 'image'"
				},
				{ status: 400 }
			);
		}

		const incomingFormData = await request.formData();
		const file = (incomingFormData.get('file') || incomingFormData.get('image')) as File | Blob | null;

		if (!file) {
			return json(
				{
					success: false,
					code: 400,
					message: "File gambar tidak ditemukan. Gunakan form-data dengan key 'file' atau 'image'"
				},
				{ status: 400 }
			);
		}

		const outboundFormData = new FormData();
		const filename = (file instanceof File && file.name) ? file.name : 'license_plate.jpg';
		outboundFormData.append('file', file, filename);
		outboundFormData.append('image', file, filename);

		// Panggilan kanonikal tunggal 1:1 ke Go backend melalui apiClient
		const result = await apiClient.raw<any>(API_ENDPOINTS.PARKING.OCR.LICENSE_PLATE, {
			method: 'POST',
			body: outboundFormData,
			fetch,
			token
		});

		const payload = result?.data || result;
		const plateNumber = (payload?.plate_number || payload?.plateNumber || payload?.plate || '').trim().toUpperCase();
		const confidence = Number(payload?.confidence ?? 0);
		const processingTimeMs = Number(payload?.processing_time_ms ?? payload?.processingTimeMs ?? 0);
		const details = payload?.details || [];

		return json({
			code: 200,
			success: true,
			message: result?.message || 'Deteksi plat nomor berhasil',
			plate_number: plateNumber,
			confidence,
			processing_time_ms: processingTimeMs,
			details,
			plate: plateNumber,
			data: {
				plate_number: plateNumber,
				confidence,
				processing_time_ms: processingTimeMs,
				details
			}
		});
	} catch (err: any) {
		console.error('[API m/ocr] OCR error:', err);
		return json(
			{
				success: false,
				code: err.status || 500,
				message: err.message || 'Terjadi kesalahan sistem saat memproses OCR'
			},
			{ status: err.status || 500 }
		);
	}
};
