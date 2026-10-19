import { json, type RequestHandler } from '@sveltejs/kit';
import { apiClient } from '$lib/server/api/client.js';
import { API_ENDPOINTS } from '$lib/server/api/endpoints.js';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
		const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : (cookies.get('access_token') || null);
		const idempotencyKey = request.headers.get('X-Idempotency-Key') || undefined;
		const body = await request.json();

		const headers: Record<string, string> = {};
		if (idempotencyKey) {
			headers['X-Idempotency-Key'] = idempotencyKey;
		}

		const response = await apiClient.post<any>(
			API_ENDPOINTS.PARKING.SESSIONS.CHECKIN,
			body,
			{
				fetch,
				token,
				headers
			}
		);

		return json({
			success: true,
			data: response
		});
	} catch (err: any) {
		console.error('[API m/sync-checkin] Error:', err);
		return json(
			{
				success: false,
				message: err.message || 'Gagal check-in'
			},
			{ status: err.status || 500 }
		);
	}
};
