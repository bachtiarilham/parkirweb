import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();
	const plateNumber = url.searchParams.get('plateNumber') || '';

	return {
		user,
		plateNumber
	};
};
