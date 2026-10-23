import { json, type RequestHandler } from '@sveltejs/kit';
import { sessionService } from '$lib/server/services/identity/session.service.js';
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE
} from '../../../../hooks.server.ts';
import { parseJwt } from '$lib/utils/jwt.js';
import { resolveRedirectPath } from '$lib/utils/resolve-redirect-path.js';

export const POST: RequestHandler = async ({ request, cookies, fetch, locals }) => {
	try {
		const body = await request.json();
		const scopeId = Number(body?.scopeId);

		if (!scopeId) {
			return json({ success: false, message: 'Scope ID wajib diisi' }, { status: 400 });
		}

		const deviceId = (locals as any).deviceId || 'web-client';
		const deviceName = (locals as any).deviceName || 'Web Browser';

		const tokenSet = await sessionService.switchScope(scopeId, {
			fetch,
			deviceId,
			deviceName
		});

		const isSecure = process.env.NODE_ENV === 'production';
		cookies.set(ACCESS_TOKEN_COOKIE, tokenSet.accessToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isSecure,
			maxAge: tokenSet.expiresIn || 60 * 60 * 24 * 7
		});

		if (tokenSet.refreshToken) {
			cookies.set(REFRESH_TOKEN_COOKIE, tokenSet.refreshToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: isSecure,
				maxAge: 60 * 60 * 24 * 30
			});
		}

		const parsedJwt = parseJwt(tokenSet.accessToken);
		if (parsedJwt) {
			const userProfile = {
				user_id: parsedJwt.user_id ? String(parsedJwt.user_id) : null,
				full_name: parsedJwt.full_name || parsedJwt.user_code || 'User',
				email: `${parsedJwt.user_code}@parkir.local`,
				role_code: parsedJwt.role_code ? String(parsedJwt.role_code) : null,
				tenantId: parsedJwt.tenant_id ? String(parsedJwt.tenant_id) : null,
				tenantCode: parsedJwt.tenant_code || null,
				branchId: parsedJwt.branch_id ? String(parsedJwt.branch_id) : null,
				branchCode: parsedJwt.branch_code || null
			};

			cookies.set(USER_COOKIE, JSON.stringify(userProfile), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: isSecure,
				maxAge: 60 * 60 * 24 * 7
			});
		}

		const targetUrl = resolveRedirectPath(parsedJwt?.role_code);

		return json({
			success: true,
			message: 'Berhasil berpindah ruang kerja',
			data: {
				role: parsedJwt?.role_code,
				branch_id: parsedJwt?.branch_id,
				branch_code: parsedJwt?.branch_code,
				targetUrl
			}
		});
	} catch (err: any) {
		console.error('[API Switch Scope Error]:', err);
		return json({ success: false, message: err?.message || 'Gagal beralih ruang kerja' }, { status: 400 });
	}
};
