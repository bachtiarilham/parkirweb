import { sessionService } from '$lib/server/services/identity/session.service.js';
import {
	ACCESS_TOKEN_COOKIE,
	REFRESH_TOKEN_COOKIE,
	USER_COOKIE
} from '../../../hooks.server.ts';
import { LoginSchema } from '$lib/schemas/auth.schema.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { parseJwt } from '$lib/utils/jwt.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user) {
		const role = (user.role_code || '').toUpperCase();
		if (role.includes('OFFICER') || role.includes('JUKIR') || role.includes('OPERATOR')) {
			redirect(302, '/m/jukir');
		} else {
			redirect(302, '/m/customer');
		}
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch, locals, url }) => {
		const formData = await request.formData();
		const rawIdentity = formData.get('identity') || formData.get('username');
		const rawPassword = formData.get('password');
		const redirectTo = url.searchParams.get('redirectTo') || formData.get('redirectTo')?.toString() || null;

		const parseResult = LoginSchema.safeParse({
			identity: rawIdentity,
			password: rawPassword
		});

		if (!parseResult.success) {
			const firstError = parseResult.error.issues[0]?.message || 'Input tidak valid';
			return fail(400, { message: firstError });
		}

		const { identity, password } = parseResult.data;
		const deviceId = formData.get('deviceId')?.toString() || (locals as any).deviceId || 'mobile-web';
		const deviceName = formData.get('deviceName')?.toString() || (locals as any).deviceName || 'Mobile Browser';

		try {
			const result = await sessionService.createSession(
				{ identity, password },
				{
					fetch,
					deviceId,
					deviceName
				}
			);

			if (!result || !result.accessToken) {
				return fail(400, { message: 'Username atau password salah' });
			}

			const isSecure = process.env.NODE_ENV === 'production';
			cookies.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: isSecure,
				maxAge: result.expiresIn || 60 * 60 * 24 * 7
			});

			if (result.refreshToken) {
				cookies.set(REFRESH_TOKEN_COOKIE, result.refreshToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					secure: isSecure,
					maxAge: 60 * 60 * 24 * 30
				});
			}

			const parsedJwt = parseJwt(result.accessToken);
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

			if (redirectTo && redirectTo.startsWith('/')) {
				redirect(302, redirectTo);
			}

			const rawRole = (parsedJwt?.role_code || '').toUpperCase();
			if (rawRole.includes('OFFICER') || rawRole.includes('JUKIR') || rawRole.includes('OPERATOR')) {
				redirect(302, '/m/jukir');
			} else {
				redirect(302, '/m/customer');
			}
		} catch (err: any) {
			console.error('[Mobile Login Error]', err);
			return fail(400, { message: err.message || 'Gagal masuk akun' });
		}
	}
};
