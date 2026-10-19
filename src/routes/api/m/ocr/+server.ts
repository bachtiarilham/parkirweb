import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { API_ENDPOINTS } from '$lib/server/api/endpoints.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// 1. Ambil Bearer JWT token dari header Authorization ATAU cookie session
		const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
		let token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;

		if (!token) {
			token = cookies.get('access_token') || cookies.get('token') || null;
		}

		// 2. Validasi Content-Type multipart/form-data
		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
			return json(
				{
					success: false,
					code: 400,
					message: "Format request harus multipart/form-data dengan field 'file' atau 'image'"
				},
				{ status: 400 }
			);
		}

		// 3. Baca multipart form-data yang diunggah
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

		// 4. Tentukan URL backend (Go park-server-v3)
		const backendBase = (
			env.BACKEND_API_URL ||
			process.env.BACKEND_API_URL ||
			env.API_BASE_URL ||
			'https://nonstatutory-wonda-preadherently.ngrok-free.dev'
		).replace(/\/+$/, '');

		let endpoint = API_ENDPOINTS.PARKING.OCR.LICENSE_PLATE;
		if (backendBase.endsWith('/api/v1') && endpoint.startsWith('/api/v1')) {
			endpoint = endpoint.replace(/^\/api\/v1/, '');
		}
		const targetUrl = `${backendBase}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

		// 4. Siapkan FormData keluar dengan key 'file' dan 'image' (1:1 kompatibel dengan Go backend, Insomnia, & Android linespotv3)
		const outboundFormData = new FormData();
		const filename = (file instanceof File && file.name) ? file.name : 'license_plate.jpg';
		outboundFormData.append('file', file, filename);
		outboundFormData.append('image', file, filename);

		// 5. Siapkan header (sertakan ngrok bypass dan JWT bearer)
		const backendHeaders: Record<string, string> = {
			'Accept': 'application/json',
			'ngrok-skip-browser-warning': 'true'
		};

		if (token) {
			backendHeaders['Authorization'] = `Bearer ${token}`;
		}

		console.log(`[OCR Proxy] Forwarding to ${targetUrl} (file: ${filename}, size: ${file.size} bytes, hasToken: ${!!token})`);

		// 6. Request langsung ke backend Go
		const resp = await fetch(targetUrl, {
			method: 'POST',
			headers: backendHeaders,
			body: outboundFormData
		});

		const respText = await resp.text();
		let result: any = null;
		try {
			result = JSON.parse(respText);
		} catch {
			result = { message: respText };
		}

		if (!resp.ok) {
			console.error(`[OCR Proxy ERROR] Status ${resp.status}:`, result);
			return json(
				{
					success: false,
					code: resp.status,
					message: result?.message || result?.error || `Gagal memproses gambar OCR (${resp.status})`,
					details: result
				},
				{ status: resp.status }
			);
		}

		// Ekstrak data hasil OCR sesuai format Go helper.Success dan PredictPlateResponse
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
			confidence: confidence,
			processing_time_ms: processingTimeMs,
			details: details,
			plate: plateNumber, // Backwards compatibility for existing client code
			data: {
				plate_number: plateNumber,
				confidence: confidence,
				processing_time_ms: processingTimeMs,
				details: details
			}
		});
	} catch (err: any) {
		console.error('[API m/ocr] Unexpected OCR error:', err);
		return json(
			{
				success: false,
				code: 500,
				message: err.message || 'Terjadi kesalahan sistem saat memproses OCR'
			},
			{ status: 500 }
		);
	}
};
