import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return {
		user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, cookies }) => {
		const formData = await request.formData();
		const fullName = formData.get('full_name')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const phoneNumber = formData.get('phone_number')?.toString() || '';

		if (!fullName.trim()) {
			return fail(400, {
				success: false,
				message: 'Nama lengkap tidak boleh kosong'
			});
		}

		// Optional: call backend api if available or return success
		return {
			success: true,
			message: 'Profil Anda berhasil diperbarui!',
			data: {
				fullName,
				email,
				phoneNumber
			}
		};
	}
};
