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
import { resolveRedirectPath } from '$lib/utils/resolve-redirect-path.js';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();
	const redirectTo = url.searchParams.get('redirectTo');

	if (user) {
		const target = resolveRedirectPath(user.role_code, redirectTo);
		redirect(302, target);
	}
	return {};
};

function setSessionCookies(cookies: any, tokens: { accessToken: string; refreshToken?: string; expiresIn?: number }) {
	const isSecure = process.env.NODE_ENV === 'production';
	cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: isSecure,
		maxAge: tokens.expiresIn || 60 * 60 * 24 * 7
	});

	if (tokens.refreshToken) {
		cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isSecure,
			maxAge: 60 * 60 * 24 * 30
		});
	}

	const parsedJwt = parseJwt(tokens.accessToken);
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

	return parsedJwt;
}

export const actions: Actions = {
	// A. Verifikasi Kredensial (Tahap 1: OIDC Pre-Auth)
	login: async ({ request, cookies, fetch, locals, url }) => {
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
			const preAuth = await sessionService.createSession(
				{ identity, password },
				{
					fetch,
					deviceId,
					deviceName
				}
			);

			if (!preAuth || !preAuth.pre_auth_token) {
				return fail(400, { message: 'Username atau password salah' });
			}

			const scopes = preAuth.accessible_scopes || [];

			if (scopes.length === 0) {
				return fail(403, { message: 'Akun Anda belum memiliki ruang kerja atau akses cabang aktif. Hubungi Administrator.' });
			}

			// Kasus 1: Hanya memiliki 1 ruang kerja -> Auto-Select (Seamless UX)
			if (scopes.length === 1) {
				const singleScope = scopes[0];
				const tokenSet = await sessionService.selectScope(
					{
						preAuthToken: preAuth.pre_auth_token,
						scopeId: singleScope.scope_id
					},
					{ fetch, deviceId, deviceName }
				);

				const parsedJwt = setSessionCookies(cookies, tokenSet);
				const target = resolveRedirectPath(parsedJwt?.role_code, redirectTo);
				redirect(302, target);
			}

			// Kasus 2: Multi-Ruang Kerja -> Tampilkan Liquid Glass Workspace Picker
			return {
				requiresScopeSelection: true,
				preAuthToken: preAuth.pre_auth_token,
				accessibleScopes: scopes,
				identity: identity
			};
		} catch (err: any) {
			if (err?.status === 302 || err?.location) {
				throw err; // SvelteKit redirect
			}
			console.error('[Login Error]', err);
			return fail(400, { message: err.message || 'Gagal masuk akun' });
		}
	},

	// B. Memilih Ruang Kerja / Cabang (Tahap 2: Scoped Token Exchange)
	selectScope: async ({ request, cookies, fetch, locals, url }) => {
		const formData = await request.formData();
		const preAuthToken = formData.get('preAuthToken')?.toString();
		const scopeIdStr = formData.get('scopeId')?.toString();
		const redirectTo = url.searchParams.get('redirectTo') || formData.get('redirectTo')?.toString() || null;

		if (!preAuthToken || !scopeIdStr) {
			return fail(400, { message: 'Token otorisasi atau pilihan cabang tidak valid' });
		}

		const scopeId = parseInt(scopeIdStr, 10);
		const deviceId = (locals as any).deviceId || 'mobile-web';
		const deviceName = (locals as any).deviceName || 'Mobile Browser';

		try {
			const tokenSet = await sessionService.selectScope(
				{
					preAuthToken,
					scopeId
				},
				{ fetch, deviceId, deviceName }
			);

			const parsedJwt = setSessionCookies(cookies, tokenSet);
			const target = resolveRedirectPath(parsedJwt?.role_code, redirectTo);
			redirect(302, target);
		} catch (err: any) {
			if (err?.status === 302 || err?.location) {
				throw err;
			}
			console.error('[Select Scope Error]', err);
			return fail(400, { message: err.message || 'Gagal memilih ruang kerja' });
		}
	}
};
