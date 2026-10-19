import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(302, '/m/login');
	}

	const role = (user.role_code || '').toUpperCase();
	if (role.includes('OFFICER') || role.includes('JUKIR') || role.includes('OPERATOR')) {
		redirect(302, '/m/jukir');
	} else {
		redirect(302, '/m/customer');
	}
};
