export type Role =
  | 'ADMIN-BRANCH'
  | 'ADMIN-TENANT'
  | 'ADMIN-SYSTEM'
  | 'CUSTOMER'
  | 'MEMBER'
  | 'USER'
  | string;

export const PAGE_ROLES: Record<string, string[]> = {
  // Dashboards
  'dashboard/member': ['CUSTOMER'],
  'dashboard/tenant': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'dashboard/branch': ['ADMIN-BRANCH', 'ADMIN-SYSTEM'],
  'dashboard/system': ['ADMIN-SYSTEM'],

  // Financial
  'financial/bank_reconciliation': ['ADMIN-SYSTEM'],
  'financial/branch_balances': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/cashier_reconciliation': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/officer_balances': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/order': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/platform_balances': ['ADMIN-SYSTEM'],
  'financial/tax_balances': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/tenant_balances': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'financial/transactions': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],

  // Identity
  'identity/branch': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'identity/gate': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'identity/session': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'identity/tenant': ['ADMIN-SYSTEM'],
  'identity/users': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'users': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],

  // Membership
  'membership/rider_contract': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'membership/rider_plan': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'membership/tenant_contract': ['ADMIN-SYSTEM'],
  'membership/tenant_plan': ['ADMIN-SYSTEM'],

  // Parking
  'parking/alarm': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/inventory': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/officer_presence': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/parking_session': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/promo': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/reservation': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/shift': ['ADMIN-BRANCH', 'ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'parking/tariff': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
  'ad': ['ADMIN-TENANT', 'ADMIN-SYSTEM'],
};

export function canAccessPage(pageSubpath: string, userRole: string | null | undefined): boolean {
  if (!userRole) {
    // Jika user terotentikasi tapi roleCode kosong/null, izinkan akses ke dashboard member
    const cleanPath = pageSubpath.replace(/^\/+/, "");
    return cleanPath === "dashboard/member";
  }

  const normalizedRole = userRole.toUpperCase().trim();
  const cleanPath = pageSubpath.replace(/^\/+/, "");

  const isRoleAllowed = (allowedRoles: string[]) => {
    return allowedRoles.some((allowed) => {
      const normAllowed = allowed.toUpperCase();
      return (
        normalizedRole === normAllowed ||
        normalizedRole.includes(normAllowed) ||
        normAllowed.includes(normalizedRole)
      );
    });
  };

  // If directly defined in PAGE_ROLES
  if (PAGE_ROLES[cleanPath]) {
    return isRoleAllowed(PAGE_ROLES[cleanPath]);
  }

  // Check matching prefix (e.g. nested subpaths)
  for (const [subpath, allowedRoles] of Object.entries(PAGE_ROLES)) {
    if (cleanPath === subpath || cleanPath.startsWith(subpath + "/")) {
      return isRoleAllowed(allowedRoles);
    }
  }

  // Route not restricted in PAGE_ROLES (e.g. /, /settings, /notifications)
  return true;
}
