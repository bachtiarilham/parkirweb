import { z } from "zod";

export const CreateTenantContractSchema = z.object({
	code: z.string().optional(),
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	plan_id: z.coerce.number().int().positive("Plan ID wajib diisi"),
	start_date: z.string().optional().nullable(),
	end_date: z.string().optional().nullable(),
	billing_cycle_months: z.coerce.number().int().positive().default(12),
	total_amount: z.coerce.number().min(0),
	status: z.string().default("ACTIVE"),
	payment_order_code: z.string().optional().nullable(),
});

export type CreateTenantContractInput = z.infer<typeof CreateTenantContractSchema>;

export const UpdateTenantContractSchema = z.object({
	plan_id: z.coerce.number().int().positive().optional().nullable(),
	start_date: z.string().optional().nullable(),
	end_date: z.string().optional().nullable(),
	billing_cycle_months: z.coerce.number().int().positive().optional().nullable(),
	total_amount: z.coerce.number().min(0).optional().nullable(),
	status: z.string().optional().nullable(),
	payment_order_code: z.string().optional().nullable(),
});

export type UpdateTenantContractInput = z.infer<typeof UpdateTenantContractSchema>;
