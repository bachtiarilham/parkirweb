import { redirect } from '@sveltejs/kit';
import { resolveRedirectPath } from '$lib/utils/resolve-redirect-path.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(302, '/login');
	}

	const target = resolveRedirectPath(user.role_code);
	redirect(302, target);
};
