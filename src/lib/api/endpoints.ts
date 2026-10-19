/**
 * =============================================================================
 * DAFTAR ENDPOINT KANONIKAL TERPUSAT (1:1 DENGAN PARK-SERVER-V3 & LINESPOT ANDROID)
 * =============================================================================
 * Base Server : https://nonstatutory-wonda-preadherently.ngrok-free.dev
 * Prefix V1   : /api/v1
 *
 * File ini dapat di-import langsung oleh SEMUA page.svelte dan service server!
 * DILARANG MENAMBAH ATAU MENGUBAH ENDPOINT SENDIRI DI LUAR KETENTUAN BACKEND.
 * =============================================================================
 */

export const BACKEND_BASE_URL = "https://nonstatutory-wonda-preadherently.ngrok-free.dev";
export const API_PREFIX_V1 = "/api/v1";

export const API_ENDPOINTS = {
	// =========================================================================
	// 0. OCR ENGINE (Kritikal: License Plate Recognition 1:1 Android & Insomnia)
	// Router Go: /api/v1/ocr/license-plate (POST multipart/form-data key: 'image')
	// =========================================================================
	OCR: {
		LICENSE_PLATE: `${API_PREFIX_V1}/ocr/license-plate`,
	},

	// =========================================================================
	// 1. IDENTITY & AUTH (SessionApiService & UserApiService)
	// =========================================================================
	AUTH: {
		LOGIN: `${API_PREFIX_V1}/users/auth/login`, // POST
		REFRESH: `${API_PREFIX_V1}/users/auth/refresh`, // GET
		LOGOUT: `${API_PREFIX_V1}/users/auth/logout`, // POST
		FORGOT_PASSWORD: `${API_PREFIX_V1}/users/auth/forgot-password`, // POST
		REGISTER: `${API_PREFIX_V1}/users`, // POST
		ME: `${API_PREFIX_V1}/users`, // GET (paginated/current)
	},

	USERS: {
		BASE: `${API_PREFIX_V1}/users`,
		LIST: `${API_PREFIX_V1}/users`, // GET
		CREATE: `${API_PREFIX_V1}/users`, // POST
		GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/users/${id}`, // GET
		UPDATE: (id: string | number) => `${API_PREFIX_V1}/users/${id}`, // PATCH
		DELETE: (id: string | number) => `${API_PREFIX_V1}/users/${id}`, // DELETE
		DETAIL: (id: string | number) => `${API_PREFIX_V1}/users/${id}`,

		PAYMENT_METHODS: {
			LIST: (userId: string | number) => `${API_PREFIX_V1}/users/${userId}/payment-methods`, // GET
			CREATE: (userId: string | number) => `${API_PREFIX_V1}/users/${userId}/payment-methods`, // POST
			DELETE: (userId: string | number, pmId: string | number) =>
				`${API_PREFIX_V1}/users/${userId}/payment-methods/${pmId}`, // DELETE
		},
	},

	// =========================================================================
	// 2. PARKING SESSIONS, TARIFFS, GATES & RECEIPT (ParkSessionApiService)
	// =========================================================================
	PARKING: {
		SESSIONS: {
			BASE: `${API_PREFIX_V1}/park_session`,
			LIST: `${API_PREFIX_V1}/park_session`, // GET
			CREATE: `${API_PREFIX_V1}/park_session`, // POST
			CHECKIN: `${API_PREFIX_V1}/park_session/checkin`, // POST (idempotent)
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/park_session/${id}`, // GET
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/park_session/${id}`, // PUT
			DELETE: (id: string | number) => `${API_PREFIX_V1}/park_session/${id}`, // DELETE
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/park_session/${id}`,
		},

		TARIFFS: {
			BASE: `${API_PREFIX_V1}/tariffs`,
			LIST: `${API_PREFIX_V1}/tariffs`, // GET (?branch_id=&tenant_id=)
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tariffs/${id}`, // GET
			CREATE: `${API_PREFIX_V1}/tariffs`, // POST
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/tariffs/${id}`, // PUT
			DELETE: (id: string | number) => `${API_PREFIX_V1}/tariffs/${id}`, // DELETE
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/tariffs/${id}`,
		},

		RECEIPT: {
			HTML: (code: string) => `${API_PREFIX_V1}/receipt/${code}`, // GET (public)
		},

		SHIFTS: {
			BASE: `${API_PREFIX_V1}/shifts`,
			LIST: `${API_PREFIX_V1}/shifts`,
			CREATE: `${API_PREFIX_V1}/shifts`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/shifts/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/shifts/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/shifts/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/shifts/${id}`,
		},

		PRESENCES: {
			BASE: `${API_PREFIX_V1}/presences`,
			LIST: `${API_PREFIX_V1}/presences`,
			CREATE: `${API_PREFIX_V1}/presences`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/presences/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/presences/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/presences/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/presences/${id}`,
		},

		PROMOS: {
			BASE: `${API_PREFIX_V1}/promos`,
			LIST: `${API_PREFIX_V1}/promos`,
			CREATE: `${API_PREFIX_V1}/promos`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/promos/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/promos/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/promos/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/promos/${id}`,
		},

		RESERVATIONS: {
			BASE: `${API_PREFIX_V1}/reservations`,
			LIST: `${API_PREFIX_V1}/reservations`,
			CREATE: `${API_PREFIX_V1}/reservations`,
			RESERVE_SLOT: `${API_PREFIX_V1}/reservations`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/reservations/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/reservations/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/reservations/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/reservations/${id}`,
		},

		INVENTORY: {
			BASE: `${API_PREFIX_V1}/inventory`,
			LIST: `${API_PREFIX_V1}/inventory`,
			CREATE: `${API_PREFIX_V1}/inventory`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/inventory/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/inventory/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/inventory/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/inventory/${id}`,
		},

		ALARMS: {
			BASE: `${API_PREFIX_V1}/alarms`,
			LIST: `${API_PREFIX_V1}/alarms`,
			CREATE: `${API_PREFIX_V1}/alarms`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/alarms/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/alarms/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/alarms/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/alarms/${id}`,
		},

		GATES: {
			BASE: `${API_PREFIX_V1}/gates`,
			LIST: `${API_PREFIX_V1}/gates`,
			CREATE: `${API_PREFIX_V1}/gates`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/gates/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/gates/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/gates/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/gates/${id}`,
		},

		OPERATIONAL: {
			PRESENCE: {
				CLOCK_IN: `${API_PREFIX_V1}/presences`,
				CLOCK_OUT: (presenceId: string | number) => `${API_PREFIX_V1}/presences/${presenceId}`,
			},
			ALARM: {
				TRIGGER: `${API_PREFIX_V1}/alarms`,
				ACKNOWLEDGE: (id: string | number) => `${API_PREFIX_V1}/alarms/${id}`,
			},
			GATE: {
				TRIGGER: (gateId: string | number) => `${API_PREFIX_V1}/gates/${gateId}`,
			},
		},

		// Alias OCR di bawah PARKING untuk backward-compatibility
		OCR: {
			LICENSE_PLATE: `${API_PREFIX_V1}/ocr/license-plate`,
		},
	},

	// =========================================================================
	// 3. TRANSAKSI, PEMBAYARAN & KEUANGAN (TransactionApiService)
	// =========================================================================
	FINANCIAL: {
		PAY_TRANSACTIONS: {
			BASE: `${API_PREFIX_V1}/pay-transactions`,
			LIST: `${API_PREFIX_V1}/pay-transactions`, // GET (?page=&limit=&start_date=&end_date=)
			CREATE: `${API_PREFIX_V1}/pay-transactions`, // POST
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/pay-transactions/${id}`, // GET
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/pay-transactions/${id}`, // PUT
			DELETE: (id: string | number) => `${API_PREFIX_V1}/pay-transactions/${id}`, // DELETE
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/pay-transactions/${id}`,
		},

		PAYMENT_CALLBACK: `${API_PREFIX_V1}/payments/callback`, // POST (Midtrans notification webhook)

		ORDERS: {
			BASE: `${API_PREFIX_V1}/orders`,
			LIST: `${API_PREFIX_V1}/orders`,
			CREATE: `${API_PREFIX_V1}/orders`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/orders/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/orders/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/orders/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/orders/${id}`,
		},

		LEDGERS: {
			BASE: `${API_PREFIX_V1}/ledgers`,
			LIST: `${API_PREFIX_V1}/ledgers`,
			CREATE: `${API_PREFIX_V1}/ledgers`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/ledgers/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/ledgers/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/ledgers/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/ledgers/${id}`,
		},

		BRANCH_BALANCES: {
			BASE: `${API_PREFIX_V1}/branch-balances`,
			LIST: `${API_PREFIX_V1}/branch-balances`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/branch-balances/${id}`,
			GET_BY_BRANCH: (branchId: string | number) => `${API_PREFIX_V1}/branch-balances/branch/${branchId}`,
			CREATE: `${API_PREFIX_V1}/branch-balances`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/branch-balances/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/branch-balances/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/branch-balances/${id}`,
		},

		OFFICER_BALANCES: {
			BASE: `${API_PREFIX_V1}/officer-balances`,
			LIST: `${API_PREFIX_V1}/officer-balances`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/officer-balances/${id}`,
			GET_BY_OFFICER: (officerUserId: string | number) =>
				`${API_PREFIX_V1}/officer-balances/officer/${officerUserId}`,
			CREATE: `${API_PREFIX_V1}/officer-balances`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/officer-balances/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/officer-balances/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/officer-balances/${id}`,
		},

		PLATFORM_BALANCES: {
			BASE: `${API_PREFIX_V1}/platform-balances`,
			LIST: `${API_PREFIX_V1}/platform-balances`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/platform-balances/${id}`,
			CREATE: `${API_PREFIX_V1}/platform-balances`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/platform-balances/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/platform-balances/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/platform-balances/${id}`,
		},

		TAX_BALANCES: {
			BASE: `${API_PREFIX_V1}/tax-balances`,
			LIST: `${API_PREFIX_V1}/tax-balances`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tax-balances/${id}`,
			GET_BY_BRANCH: (branchId: string | number) => `${API_PREFIX_V1}/tax-balances/branch/${branchId}`,
			CREATE: `${API_PREFIX_V1}/tax-balances`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/tax-balances/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/tax-balances/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/tax-balances/${id}`,
		},

		TENANT_BALANCES: {
			BASE: `${API_PREFIX_V1}/tenant-balances`,
			LIST: `${API_PREFIX_V1}/tenant-balances`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tenant-balances/${id}`,
			GET_BY_TENANT: (tenantId: string | number) => `${API_PREFIX_V1}/tenant-balances/tenant/${tenantId}`,
			CREATE: `${API_PREFIX_V1}/tenant-balances`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/tenant-balances/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/tenant-balances/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/tenant-balances/${id}`,
		},

		BANK_RECONCILIATIONS: {
			BASE: `${API_PREFIX_V1}/bank-reconciliations`,
			LIST: `${API_PREFIX_V1}/bank-reconciliations`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/bank-reconciliations/${id}`,
			CREATE: `${API_PREFIX_V1}/bank-reconciliations`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/bank-reconciliations/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/bank-reconciliations/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/bank-reconciliations/${id}`,
		},

		CASHIER_RECONCILIATIONS: {
			BASE: `${API_PREFIX_V1}/cashier-reconciliations`,
			LIST: `${API_PREFIX_V1}/cashier-reconciliations`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/cashier-reconciliations/${id}`,
			CREATE: `${API_PREFIX_V1}/cashier-reconciliations`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/cashier-reconciliations/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/cashier-reconciliations/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/cashier-reconciliations/${id}`,
		},
	},

	// =========================================================================
	// 4. MEMBERSHIP & RIDER CONTRACTS (MembershipApiService)
	// =========================================================================
	MEMBERSHIP: {
		RIDER_PLANS: {
			BASE: `${API_PREFIX_V1}/rider-plans`,
			LIST: `${API_PREFIX_V1}/rider-plans`, // GET
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/rider-plans/${id}`, // GET
			CREATE: `${API_PREFIX_V1}/rider-plans`, // POST
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/rider-plans/${id}`, // PUT
			DELETE: (id: string | number) => `${API_PREFIX_V1}/rider-plans/${id}`, // DELETE
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/rider-plans/${id}`,
		},

		RIDER_CONTRACTS: {
			BASE: `${API_PREFIX_V1}/rider-contracts`,
			LIST: `${API_PREFIX_V1}/rider-contracts`, // GET
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/rider-contracts/${id}`, // GET
			CREATE: `${API_PREFIX_V1}/rider-contracts`, // POST
			RENEW: `${API_PREFIX_V1}/rider-contracts/renew`, // POST
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/rider-contracts/${id}`, // PUT
			DELETE: (id: string | number) => `${API_PREFIX_V1}/rider-contracts/${id}`, // DELETE
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/rider-contracts/${id}`,

			VEHICLES: {
				LIST: (contractId: string | number) => `${API_PREFIX_V1}/rider-contracts/${contractId}/vehicles`,
				CREATE: (contractId: string | number) => `${API_PREFIX_V1}/rider-contracts/${contractId}/vehicles`,
				UPDATE: (contractId: string | number, vehicleId: string | number) =>
					`${API_PREFIX_V1}/rider-contracts/${contractId}/vehicles/${vehicleId}`,
				TOGGLE_ACTIVE: (contractId: string | number) =>
					`${API_PREFIX_V1}/rider-contracts/${contractId}/vehicles/toggle-active`,
				DELETE: (contractId: string | number, vehicleId: string | number) =>
					`${API_PREFIX_V1}/rider-contracts/${contractId}/vehicles/${vehicleId}`,
			},
		},

		TENANT_PLANS: {
			BASE: `${API_PREFIX_V1}/tenant-plans`,
			LIST: `${API_PREFIX_V1}/tenant-plans`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tenant-plans/${id}`,
			CREATE: `${API_PREFIX_V1}/tenant-plans`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/tenant-plans/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/tenant-plans/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/tenant-plans/${id}`,
		},

		TENANT_CONTRACTS: {
			BASE: `${API_PREFIX_V1}/tenant-contracts`,
			LIST: `${API_PREFIX_V1}/tenant-contracts`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tenant-contracts/${id}`,
			CREATE: `${API_PREFIX_V1}/tenant-contracts`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/tenant-contracts/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/tenant-contracts/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/tenant-contracts/${id}`,
		},

		RENEWAL: {
			BASE: `${API_PREFIX_V1}/renewal`,
			LIST: `${API_PREFIX_V1}/renewal`,
			CREATE: `${API_PREFIX_V1}/renewal`,
			EXECUTE: `${API_PREFIX_V1}/renewal/execute`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/renewal/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/renewal/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/renewal/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/renewal/${id}`,
		},
	},

	// =========================================================================
	// 5. ANALYTICS & DASHBOARD (DashboardApiService)
	// =========================================================================
	ANALYTICS: {
		MEMBER_DASHBOARD: `${API_PREFIX_V1}/analytics/member-dashboard`, // GET
		OFFICER_DASHBOARD: `${API_PREFIX_V1}/analytics/mobile-officer-dashboard`, // GET
		SUMMARY: `${API_PREFIX_V1}/analytics/summary`, // GET (?start_date=&end_date=)
		TENANT_DASHBOARD: `${API_PREFIX_V1}/analytics/tenant-dashboard`, // GET
		BRANCH_DASHBOARD: `${API_PREFIX_V1}/analytics/branch-dashboard`, // GET
		SYSTEM_DASHBOARD: `${API_PREFIX_V1}/analytics/system-dashboard`, // GET
	},

	// =========================================================================
	// 6. STORAGE (StorageApiService)
	// =========================================================================
	STORAGE: {
		UPLOAD: `${API_PREFIX_V1}/storage/upload`, // POST multipart/form-data
		FILE: `${API_PREFIX_V1}/storage/file`, // GET (stream public)
		PRESIGNED_URL: `${API_PREFIX_V1}/storage/presigned-url`, // GET
		DELETE: `${API_PREFIX_V1}/storage/file`, // DELETE
	},

	// =========================================================================
	// 7. IDENTITY INFRASTRUCTURE (BRANCHES, TENANTS, PARTNERS)
	// =========================================================================
	BRANCHES: {
		BASE: `${API_PREFIX_V1}/branches`,
		LIST: `${API_PREFIX_V1}/branches`,
		CREATE: `${API_PREFIX_V1}/branches`,
		GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/branches/${id}`,
		UPDATE: (id: string | number) => `${API_PREFIX_V1}/branches/${id}`,
		DELETE: (id: string | number) => `${API_PREFIX_V1}/branches/${id}`,
		DETAIL: (id: string | number) => `${API_PREFIX_V1}/branches/${id}`,

		GATES: {
			BASE: (branchId: string | number) => `${API_PREFIX_V1}/branches/${branchId}/gates`,
			LIST: (branchId: string | number) => `${API_PREFIX_V1}/branches/${branchId}/gates`,
			CREATE: (branchId: string | number) => `${API_PREFIX_V1}/branches/${branchId}/gates`,
			GET_BY_ID: (branchId: string | number, deviceId: string | number) =>
				`${API_PREFIX_V1}/branches/${branchId}/gates/${deviceId}`,
			UPDATE: (branchId: string | number, deviceId: string | number) =>
				`${API_PREFIX_V1}/branches/${branchId}/gates/${deviceId}`,
			DELETE: (branchId: string | number, deviceId: string | number) =>
				`${API_PREFIX_V1}/branches/${branchId}/gates/${deviceId}`,
		},
	},

	TENANTS: {
		BASE: `${API_PREFIX_V1}/tenants`,
		LIST: `${API_PREFIX_V1}/tenants`,
		CREATE: `${API_PREFIX_V1}/tenants`,
		GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/tenants/${id}`,
		UPDATE: (id: string | number) => `${API_PREFIX_V1}/tenants/${id}`,
		DELETE: (id: string | number) => `${API_PREFIX_V1}/tenants/${id}`,
		DETAIL: (id: string | number) => `${API_PREFIX_V1}/tenants/${id}`,
	},

	PARTNERS: {
		BASE: `${API_PREFIX_V1}/partners`,
		LIST: `${API_PREFIX_V1}/partners`,
		CREATE: `${API_PREFIX_V1}/partners`,
		GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/partners/${id}`,
		UPDATE: (id: string | number) => `${API_PREFIX_V1}/partners/${id}`,
		DELETE: (id: string | number) => `${API_PREFIX_V1}/partners/${id}`,
		DETAIL: (id: string | number) => `${API_PREFIX_V1}/partners/${id}`,
	},

	// =========================================================================
	// 8. SHARED (VEHICLES, LICENSES, REVIEWS, COMPLAINTS, NOTIFICATIONS)
	// =========================================================================
	SHARED: {
		VEHICLES: {
			BASE: `${API_PREFIX_V1}/vehicles`,
			LIST: `${API_PREFIX_V1}/vehicles`,
			CREATE: `${API_PREFIX_V1}/vehicles`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/vehicles/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/vehicles/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/vehicles/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/vehicles/${id}`,
			BLACKLIST: (id: string | number) => `${API_PREFIX_V1}/vehicles/${id}/blacklist`,
		},

		LICENSES: {
			BASE: `${API_PREFIX_V1}/licenses`,
			LIST: `${API_PREFIX_V1}/licenses`,
			CREATE: `${API_PREFIX_V1}/licenses`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/licenses/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/licenses/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/licenses/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/licenses/${id}`,
		},

		REVIEWS: {
			BASE: `${API_PREFIX_V1}/reviews`,
			LIST: `${API_PREFIX_V1}/reviews`,
			CREATE: `${API_PREFIX_V1}/reviews`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/reviews/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/reviews/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/reviews/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/reviews/${id}`,
		},

		COMPLAINTS: {
			BASE: `${API_PREFIX_V1}/complaints`,
			LIST: `${API_PREFIX_V1}/complaints`,
			CREATE: `${API_PREFIX_V1}/complaints`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/complaints/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/complaints/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/complaints/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/complaints/${id}`,
		},

		NOTIFICATIONS: {
			BASE: `${API_PREFIX_V1}/notifications`,
			LIST: `${API_PREFIX_V1}/notifications`,
			CREATE: `${API_PREFIX_V1}/notifications`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/notifications/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/notifications/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/notifications/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/notifications/${id}`,
		},

		DISTRIBUTED_TRANSACTIONS: {
			BASE: `${API_PREFIX_V1}/distributed-transactions`,
			LIST: `${API_PREFIX_V1}/distributed-transactions`,
			CREATE: `${API_PREFIX_V1}/distributed-transactions`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/distributed-transactions/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/distributed-transactions/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/distributed-transactions/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/distributed-transactions/${id}`,
		},

		VEHICLE_CATEGORIES: {
			BASE: `${API_PREFIX_V1}/vehicle-categories`,
			LIST: `${API_PREFIX_V1}/vehicle-categories`,
			CREATE: `${API_PREFIX_V1}/vehicle-categories`,
			GET_BY_ID: (id: string | number) => `${API_PREFIX_V1}/vehicle-categories/${id}`,
			UPDATE: (id: string | number) => `${API_PREFIX_V1}/vehicle-categories/${id}`,
			DELETE: (id: string | number) => `${API_PREFIX_V1}/vehicle-categories/${id}`,
			DETAIL: (id: string | number) => `${API_PREFIX_V1}/vehicle-categories/${id}`,
		},
	},

	// =========================================================================
	// 9. AD EVENTS & MARKETING
	// =========================================================================
	ADS: {
		BASE: `${API_PREFIX_V1}/ads`,
		LIST: `${API_PREFIX_V1}/ads`,
		CREATE: `${API_PREFIX_V1}/ads`,
		CLICK: `${API_PREFIX_V1}/ads/click`,
		POPULAR: `${API_PREFIX_V1}/ads/popular`,
	},

	// =========================================================================
	// 10. SYSTEM & DIAGNOSTICS
	// =========================================================================
	HEALTH: "/health",
	METRICS: "/metrics",
	SWAGGER: "/swagger/index.html",
} as const;
