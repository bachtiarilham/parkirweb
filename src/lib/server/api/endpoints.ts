/**
 * Daftar endpoint terpusat untuk komunikasi dengan server backend Go (park-server-v3).
 * Base Server: https://nonstatutory-wonda-preadherently.ngrok-free.dev
 * Semua endpoint API V1 diawali dengan prefix /api/v1
 */

const V1 = "/api/v1";

export const API_ENDPOINTS = {
	// =========================================================================
	// 0. SYSTEM & DIAGNOSTICS
	// =========================================================================
	HEALTH: "/health",
	METRICS: "/metrics",
	SWAGGER: "/swagger/index.html",

	// =========================================================================
	// 1. IDENTITY & ACCESS MANAGEMENT (AUTH, USERS, BRANCHES, TENANTS, PARTNERS)
	// =========================================================================
	AUTH: {
		LOGIN: `${V1}/users/auth/login`, // POST
		REFRESH: `${V1}/users/auth/refresh`, // GET
		LOGOUT: `${V1}/users/auth/logout`, // POST
		FORGOT_PASSWORD: `${V1}/users/auth/forgot-password`, // POST
		REGISTER: `${V1}/users`, // POST (alias create user)
		ME: `${V1}/users`, // GET (dengan auth token)
	},

	USERS: {
		BASE: `${V1}/users`,
		LIST: `${V1}/users`, // GET (paginated)
		CREATE: `${V1}/users`, // POST
		GET_BY_ID: (id: string | number) => `${V1}/users/${id}`, // GET
		UPDATE: (id: string | number) => `${V1}/users/${id}`, // PATCH
		DELETE: (id: string | number) => `${V1}/users/${id}`, // DELETE
		DETAIL: (id: string | number) => `${V1}/users/${id}`,

		// User Payment Methods
		PAYMENT_METHODS: {
			LIST: (userId: string | number) => `${V1}/users/${userId}/payment-methods`, // GET
			CREATE: (userId: string | number) => `${V1}/users/${userId}/payment-methods`, // POST
			DELETE: (userId: string | number, pmId: string | number) =>
				`${V1}/users/${userId}/payment-methods/${pmId}`, // DELETE
		},
	},

	BRANCHES: {
		BASE: `${V1}/branches`,
		LIST: `${V1}/branches`, // GET
		CREATE: `${V1}/branches`, // POST
		GET_BY_ID: (id: string | number) => `${V1}/branches/${id}`, // GET
		UPDATE: (id: string | number) => `${V1}/branches/${id}`, // PATCH
		DELETE: (id: string | number) => `${V1}/branches/${id}`, // DELETE
		DETAIL: (id: string | number) => `${V1}/branches/${id}`,

		// Gates / Devices inside Branch
		GATES: {
			BASE: (branchId: string | number) => `${V1}/branches/${branchId}/gates`,
			LIST: (branchId: string | number) => `${V1}/branches/${branchId}/gates`, // GET
			CREATE: (branchId: string | number) => `${V1}/branches/${branchId}/gates`, // POST
			GET_BY_ID: (branchId: string | number, deviceId: string | number) =>
				`${V1}/branches/${branchId}/gates/${deviceId}`, // GET
			UPDATE: (branchId: string | number, deviceId: string | number) =>
				`${V1}/branches/${branchId}/gates/${deviceId}`, // PATCH
			DELETE: (branchId: string | number, deviceId: string | number) =>
				`${V1}/branches/${branchId}/gates/${deviceId}`, // DELETE
			DETAIL: (branchId: string | number, deviceId: string | number) =>
				`${V1}/branches/${branchId}/gates/${deviceId}`,
		},
	},

	TENANTS: {
		BASE: `${V1}/tenants`,
		LIST: `${V1}/tenants`, // GET
		CREATE: `${V1}/tenants`, // POST
		GET_BY_ID: (id: string | number) => `${V1}/tenants/${id}`, // GET
		UPDATE: (id: string | number) => `${V1}/tenants/${id}`, // PATCH
		DELETE: (id: string | number) => `${V1}/tenants/${id}`, // DELETE
		DETAIL: (id: string | number) => `${V1}/tenants/${id}`,
	},

	PARTNERS: {
		BASE: `${V1}/partners`,
		LIST: `${V1}/partners`, // GET
		CREATE: `${V1}/partners`, // POST
		GET_BY_ID: (id: string | number) => `${V1}/partners/${id}`, // GET
		UPDATE: (id: string | number) => `${V1}/partners/${id}`, // PUT
		DELETE: (id: string | number) => `${V1}/partners/${id}`, // DELETE
		DETAIL: (id: string | number) => `${V1}/partners/${id}`,
	},

	// =========================================================================
	// 2. ANALYTICS & DASHBOARD
	// =========================================================================
	ANALYTICS: {
		SUMMARY: `${V1}/analytics/summary`, // GET
		TENANT_DASHBOARD: `${V1}/analytics/tenant-dashboard`, // GET
		BRANCH_DASHBOARD: `${V1}/analytics/branch-dashboard`, // GET
		SYSTEM_DASHBOARD: `${V1}/analytics/system-dashboard`, // GET
		MEMBER_DASHBOARD: `${V1}/analytics/member-dashboard`, // GET
		MOBILE_OFFICER_DASHBOARD: `${V1}/analytics/mobile-officer-dashboard`, // GET
	},

	// =========================================================================
	// 3. PARKING OPERATIONS (SESSIONS, OVERRIDES, RESERVATIONS, SHIFTS, TARIFFS, PROMOS)
	// =========================================================================
	PARKING: {
		// Park Sessions / Tickets
		SESSIONS: {
			BASE: `${V1}/park_session`,
			LIST: `${V1}/park_session`, // GET
			CREATE: `${V1}/park_session`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/park_session/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/park_session/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/park_session/${id}`, // DELETE
			CHECKIN: `${V1}/park_session/checkin`, // POST
		},

		// OCR Engine
		OCR: {
			LICENSE_PLATE: `${V1}/ocr/license-plate`, // POST multipart/form-data
		},

		// Telemetry & Hardware Operational
		OPERATIONAL: {
			GATE: {
				PING: (id: string | number) => `${V1}/operational/gate/${id}/ping`, // POST
				OVERRIDE: {
					GET: (id: string | number) => `${V1}/operational/gate/override/${id}/override`, // GET
					CREATE: (id: string | number) => `${V1}/operational/gate/override/${id}/override`, // POST
				},
			},
			PRESENCE: {
				CLOCK_IN: `${V1}/operational/presence/clockin`, // POST
				CLOCK_OUT: (id: string | number) => `${V1}/operational/presence/clockout/${id}`, // POST
			},
			ALARM: {
				TRIGGER: `${V1}/operational/alarm/alarm/trigger`, // POST
				ACKNOWLEDGE: (id: string | number) => `${V1}/operational/alarm/alarm/ack/${id}`, // POST
			},
		},

		// Reservations
		RESERVATIONS: {
			BASE: `${V1}/reservation`,
			LIST: `${V1}/reservation`, // GET
			CREATE: `${V1}/reservation`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/reservation/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/reservation/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/reservation/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/reservation/${id}`,
			RESERVE_SLOT: `${V1}/reservation/reserve`, // POST
		},

		// Hardware / Parking Inventory
		INVENTORY: {
			BASE: `${V1}/inventory`,
			LIST: `${V1}/inventory`, // GET
			CREATE: `${V1}/inventory`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/inventory/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/inventory/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/inventory/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/inventory/${id}`,
		},

		// Shifts
		SHIFTS: {
			BASE: `${V1}/shifts`,
			LIST: `${V1}/shifts`, // GET
			CREATE: `${V1}/shifts`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/shifts/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/shifts/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/shifts/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/shifts/${id}`,
		},

		// Tariffs
		TARIFFS: {
			BASE: `${V1}/tariffs`,
			LIST: `${V1}/tariffs`, // GET
			CREATE: `${V1}/tariffs`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/tariffs/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/tariffs/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/tariffs/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/tariffs/${id}`,
		},

		// Promos
		PROMOS: {
			BASE: `${V1}/promos`,
			LIST: `${V1}/promos`, // GET
			CREATE: `${V1}/promos`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/promos/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/promos/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/promos/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/promos/${id}`,
		},
	},

	// =========================================================================
	// 4. FINANCIAL & BALANCES (TRANSACTIONS, ORDERS, LEDGERS, RECONCILIATIONS)
	// =========================================================================
	FINANCIAL: {
		PAYMENTS: {
			CALLBACK: `${V1}/payments/callback`, // POST
		},

		BRANCH_BALANCES: {
			BASE: `${V1}/branch-balances`,
			LIST: `${V1}/branch-balances`, // GET
			CREATE: `${V1}/branch-balances`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/branch-balances/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/branch-balances/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/branch-balances/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/branch-balances/${id}`,
			GET_BY_BRANCH: (branchId: string | number) =>
				`${V1}/branch-balances/branch/${branchId}`, // GET
		},

		OFFICER_BALANCES: {
			BASE: `${V1}/officer-balances`,
			LIST: `${V1}/officer-balances`, // GET
			CREATE: `${V1}/officer-balances`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/officer-balances/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/officer-balances/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/officer-balances/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/officer-balances/${id}`,
			GET_BY_OFFICER: (officerUserId: string | number) =>
				`${V1}/officer-balances/officer/${officerUserId}`, // GET
		},

		PLATFORM_BALANCES: {
			BASE: `${V1}/platform-balances`,
			LIST: `${V1}/platform-balances`, // GET
			CREATE: `${V1}/platform-balances`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/platform-balances/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/platform-balances/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/platform-balances/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/platform-balances/${id}`,
		},

		TAX_BALANCES: {
			BASE: `${V1}/tax-balances`,
			LIST: `${V1}/tax-balances`, // GET
			CREATE: `${V1}/tax-balances`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/tax-balances/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/tax-balances/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/tax-balances/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/tax-balances/${id}`,
			GET_BY_BRANCH: (branchId: string | number) =>
				`${V1}/tax-balances/branch/${branchId}`, // GET
		},

		TENANT_BALANCES: {
			BASE: `${V1}/tenant-balances`,
			LIST: `${V1}/tenant-balances`, // GET
			CREATE: `${V1}/tenant-balances`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/tenant-balances/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/tenant-balances/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/tenant-balances/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/tenant-balances/${id}`,
			GET_BY_TENANT: (tenantId: string | number) =>
				`${V1}/tenant-balances/tenant/${tenantId}`, // GET
		},

		BANK_RECONCILIATIONS: {
			BASE: `${V1}/bank-reconciliations`,
			LIST: `${V1}/bank-reconciliations`, // GET
			CREATE: `${V1}/bank-reconciliations`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/bank-reconciliations/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/bank-reconciliations/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/bank-reconciliations/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/bank-reconciliations/${id}`,
		},

		CASHIER_RECONCILIATIONS: {
			BASE: `${V1}/cashier-reconciliations`,
			LIST: `${V1}/cashier-reconciliations`, // GET
			CREATE: `${V1}/cashier-reconciliations`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/cashier-reconciliations/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/cashier-reconciliations/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/cashier-reconciliations/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/cashier-reconciliations/${id}`,
		},

		LEDGERS: {
			BASE: `${V1}/ledgers`,
			LIST: `${V1}/ledgers`, // GET
			CREATE: `${V1}/ledgers`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/ledgers/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/ledgers/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/ledgers/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/ledgers/${id}`,
		},

		ORDERS: {
			BASE: `${V1}/orders`,
			LIST: `${V1}/orders`, // GET
			CREATE: `${V1}/orders`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/orders/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/orders/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/orders/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/orders/${id}`,
		},

		PAY_TRANSACTIONS: {
			BASE: `${V1}/pay-transactions`,
			LIST: `${V1}/pay-transactions`, // GET
			CREATE: `${V1}/pay-transactions`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/pay-transactions/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/pay-transactions/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/pay-transactions/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/pay-transactions/${id}`,
		},
	},

	// =========================================================================
	// 5. MEMBERSHIP & PLANS (RENEWALS, CONTRACTS, PLANS)
	// =========================================================================
	MEMBERSHIP: {
		RENEWAL: {
			BASE: `${V1}/renewal`,
			LIST: `${V1}/renewal`, // GET
			CREATE: `${V1}/renewal`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/renewal/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/renewal/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/renewal/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/renewal/${id}`,
		},

		RIDER_CONTRACTS: {
			BASE: `${V1}/rider-contracts`,
			LIST: `${V1}/rider-contracts`, // GET
			CREATE: `${V1}/rider-contracts`, // POST
			RENEW: `${V1}/rider-contracts/renew`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/rider-contracts/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/rider-contracts/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/rider-contracts/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/rider-contracts/${id}`,

			VEHICLES: {
				LIST: (contractId: string | number) => `${V1}/rider-contracts/${contractId}/vehicles`, // GET
				CREATE: (contractId: string | number) => `${V1}/rider-contracts/${contractId}/vehicles`, // POST
				UPDATE: (contractId: string | number, vehicleId: string | number) =>
					`${V1}/rider-contracts/${contractId}/vehicles/${vehicleId}`, // PUT
				TOGGLE_ACTIVE: (contractId: string | number) =>
					`${V1}/rider-contracts/${contractId}/vehicles/toggle-active`, // PATCH
				DELETE: (contractId: string | number, vehicleId: string | number) =>
					`${V1}/rider-contracts/${contractId}/vehicles/${vehicleId}`, // DELETE
			},
		},

		TENANT_CONTRACTS: {
			BASE: `${V1}/tenant-contracts`,
			LIST: `${V1}/tenant-contracts`, // GET
			CREATE: `${V1}/tenant-contracts`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/tenant-contracts/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/tenant-contracts/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/tenant-contracts/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/tenant-contracts/${id}`,
		},

		RIDER_PLANS: {
			BASE: `${V1}/rider-plans`,
			LIST: `${V1}/rider-plans`, // GET
			CREATE: `${V1}/rider-plans`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/rider-plans/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/rider-plans/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/rider-plans/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/rider-plans/${id}`,
		},

		TENANT_PLANS: {
			BASE: `${V1}/tenant-plans`,
			LIST: `${V1}/tenant-plans`, // GET
			CREATE: `${V1}/tenant-plans`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/tenant-plans/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/tenant-plans/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/tenant-plans/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/tenant-plans/${id}`,
		},
	},

	// =========================================================================
	// 6. SHARED DOMAIN (VEHICLES, LICENSES, REVIEWS, COMPLAINTS, NOTIFICATIONS, SAGAS)
	// =========================================================================
	SHARED: {
		VEHICLES: {
			BASE: `${V1}/vehicles`,
			LIST: `${V1}/vehicles`, // GET
			CREATE: `${V1}/vehicles`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/vehicles/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/vehicles/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/vehicles/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/vehicles/${id}`,
			BLACKLIST: (id: string | number) => `${V1}/vehicles/${id}/blacklist`, // PATCH (toggle cekal)
		},

		LICENSES: {
			BASE: `${V1}/licenses`,
			LIST: `${V1}/licenses`, // GET
			CREATE: `${V1}/licenses`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/licenses/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/licenses/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/licenses/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/licenses/${id}`,
		},

		REVIEWS: {
			BASE: `${V1}/reviews`,
			LIST: `${V1}/reviews`, // GET
			CREATE: `${V1}/reviews`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/reviews/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/reviews/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/reviews/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/reviews/${id}`,
		},

		COMPLAINTS: {
			BASE: `${V1}/complaints`,
			LIST: `${V1}/complaints`, // GET
			CREATE: `${V1}/complaints`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/complaints/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/complaints/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/complaints/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/complaints/${id}`,
		},

		NOTIFICATIONS: {
			BASE: `${V1}/notifications`,
			LIST: `${V1}/notifications`, // GET
			CREATE: `${V1}/notifications`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/notifications/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/notifications/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/notifications/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/notifications/${id}`,
		},

		DISTRIBUTED_TRANSACTIONS: {
			BASE: `${V1}/distributed-transactions`,
			LIST: `${V1}/distributed-transactions`, // GET
			CREATE: `${V1}/distributed-transactions`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/distributed-transactions/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/distributed-transactions/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/distributed-transactions/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/distributed-transactions/${id}`,
		},

		VEHICLE_CATEGORIES: {
			BASE: `${V1}/vehicle-categories`,
			LIST: `${V1}/vehicle-categories`, // GET
			CREATE: `${V1}/vehicle-categories`, // POST
			GET_BY_ID: (id: string | number) => `${V1}/vehicle-categories/${id}`, // GET
			UPDATE: (id: string | number) => `${V1}/vehicle-categories/${id}`, // PUT
			DELETE: (id: string | number) => `${V1}/vehicle-categories/${id}`, // DELETE
			DETAIL: (id: string | number) => `${V1}/vehicle-categories/${id}`,
		},
	},

	// =========================================================================
	// 7. AD EVENTS & MARKETING
	// =========================================================================
	ADS: {
		BASE: `${V1}/ads`,
		LIST: `${V1}/ads`, // GET (active ads)
		CREATE: `${V1}/ads`, // POST (protected tenant)
		CLICK: `${V1}/ads/click`, // POST
		POPULAR: `${V1}/ads/popular`, // GET
	},
} as const;
