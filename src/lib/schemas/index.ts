// =============================================================================
// DOMAIN SCHEMAS EXPORTS (Mencakup seluruh domain validasi Zod sesuai src/types)
// =============================================================================

// 1. Ad & Marketing
export * from "./ad/ad.schema.js";

// 2. Analytics
export * from "./analytics/dashboard.schema.js";
export * from "./analytics/report.schema.js";

// 3. Financial & Balances
export * from "./financial/bank_reconciliation.schema.js";
export * from "./financial/branch_balances.schema.js";
export * from "./financial/cashier_reconciliation.schema.js";
export * from "./financial/officer_balances.schema.js";
export * from "./financial/order.schema.js";
export * from "./financial/platform_balances.schema.js";
export * from "./financial/tax_balances.schema.js";
export * from "./financial/tenant_balances.schema.js";
export * from "./financial/transactions.schema.js";

// 4. Identity & Access
export * from "./identity/branch.schema.js";
export * from "./identity/gate.schema.js";
export * from "./identity/session.schema.js";
export * from "./identity/tenant.schema.js";
export * from "./identity/user.schema.js";

// 5. Membership
export * from "./membership/rider_contract.schema.js";
export * from "./membership/rider_plan.schema.js";
export * from "./membership/tenant_contract.schema.js";
export * from "./membership/tenant_plan.schema.js";

// 6. Parking Operations
export * from "./parking/alarm.schema.js";
export * from "./parking/inventory.schema.js";
export * from "./parking/officer_presence.schema.js";
export * from "./parking/parking_session.schema.js";
export * from "./parking/promo.schema.js";
export * from "./parking/reservation.schema.js";
export * from "./parking/shift.schema.js";
export * from "./parking/tariff.schema.js";


