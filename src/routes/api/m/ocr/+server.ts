import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { API_ENDPOINTS } from '$lib/server/api/endpoints.js';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const token = cookies.get('access_token') || null;
		const formData = await request.formData();

		const backendBase = env.API_BASE_URL || 'http://localhost:8080';
		const targetUrl = `${backendBase}${API_ENDPOINTS.PARKING.OCR.LICENSE_PLATE}`;

		const backendHeaders: Record<string, string> = {};
		if (token) {
			backendHeaders['Authorization'] = `Bearer ${token}`;
		}

		const resp = await fetch(targetUrl, {
			method: 'POST',
			headers: backendHeaders,
			body: formData
		});

		const result = await resp.json();

		if (!resp.ok) {
			return json(
				{
					success: false,
					message: result.message || 'Gagal memproses gambar OCR'
				},
				{ status: resp.status }
			);
		}

		return json({
			success: true,
			data: result.data || result
		});
	} catch (err: any) {
		console.error('[API m/ocr] OCR processing error:', err);
		return json(
			{
				success: false,
				message: err.message || 'Terjadi kesalahan sistem saat memproses OCR'
			},
			{ status: 500 }
		);
	}
};
