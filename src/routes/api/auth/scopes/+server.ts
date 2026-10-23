import { json, type RequestHandler } from '@sveltejs/kit';
import { sessionService } from '$lib/server/services/identity/session.service.js';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const scopes = await sessionService.getScopes({ fetch });
		return json({
			success: true,
			data: scopes
		});
	} catch (err: any) {
		console.error('[API Get Scopes Error]:', err);
		return json({ success: false, message: err?.message || 'Gagal memuat daftar ruang kerja' }, { status: 400 });
	}
};
