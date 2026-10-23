/**
 * Memetakan peran (role) pengguna ke rute destinasi awal masing-masing:
 * 1. system -> /dashboard/system
 * 2. tenant -> /dashboard/tenant
 * 3. branch -> /dashboard/branch
 * 4. jukir -> /m/jukir
 * 5. customer -> /m/customer
 */
export function resolveRedirectPath(
	roleCode: string | null | undefined,
	redirectTo: string | null = null
): string {
	if (redirectTo && redirectTo.startsWith('/')) {
		return redirectTo;
	}

	const rawRole = (roleCode || '').toUpperCase().trim();

	if (rawRole.includes('SYSTEM') || rawRole.includes('SUPER')) {
		return '/dashboard/system';
	}

	if (rawRole.includes('TENANT')) {
		return '/dashboard/tenant';
	}

	if (rawRole.includes('BRANCH')) {
		return '/dashboard/branch';
	}

	if (rawRole.includes('OFFICER') || rawRole.includes('JUKIR') || rawRole.includes('OPERATOR')) {
		return '/m/jukir';
	}

	// Default role (CUSTOMER, MEMBER, USER, dll)
	return '/m/customer';
}
