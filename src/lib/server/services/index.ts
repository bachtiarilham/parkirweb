// =============================================================================
// DOMAIN SERVICES EXPORTS (Mencakup seluruh domain sesuai struktur src/types)
// =============================================================================

// 1. Ad & Marketing
export * from "./ad/ad.service.js";

// 2. Analytics
export * from "./analytics/dashboard.service.js";
export * from "./analytics/report.service.js";

// 3. Financial & Balances
export * from "./financial/bank_reconciliation.service.js";
export * from "./financial/branch_balances.service.js";
export * from "./financial/cashier_reconciliation.service.js";
export * from "./financial/officer_balances.service.js";
export * from "./financial/order.service.js";
export * from "./financial/platform_balances.service.js";
export * from "./financial/tax_balances.service.js";
export * from "./financial/tenant_balances.service.js";
export * from "./financial/transactions.service.js";

// 4. Identity & Access
export * from "./identity/branch.service.js";
export * from "./identity/gate.service.js";
export * from "./identity/session.service.js";
export * from "./identity/tenant.service.js";
export * from "./identity/user.service.js";

// 5. Membership
export * from "./membership/rider_contract.service.js";
export * from "./membership/rider_plan.service.js";
export * from "./membership/tenant_contract.service.js";
export * from "./membership/tenant_plan.service.js";

// 6. Parking Operations
export * from "./parking/alarm.service.js";
export * from "./parking/inventory.service.js";
export * from "./parking/officer_presence.service.js";
export * from "./parking/parking_session.service.js";
export * from "./parking/promo.service.js";
export * from "./parking/reservation.service.js";
export * from "./parking/shift.service.js";
export * from "./parking/tariff.service.js";

// Backward compatibility helpers for routes
export { statsService } from "./stats.service.js";
