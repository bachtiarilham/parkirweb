import { z } from "zod";

export const CreateCashierReconciliationSchema = z.object({
	code: z.string().optional(),
	shift_id: z.coerce.number().int().positive("Shift ID wajib diisi"),
	officer_user_id: z.coerce.number().int().positive("Officer User ID wajib diisi"),
	expected_cash_revenue: z.coerce.number().min(0),
	actual_cash_reported: z.coerce.number().min(0),
	status: z.string().default("PENDING"),
});

export type CreateCashierReconciliationInput = z.infer<typeof CreateCashierReconciliationSchema>;

export const UpdateCashierReconciliationSchema = z.object({
	code: z.string().optional().nullable(),
	shift_id: z.coerce.number().int().positive().optional().nullable(),
	officer_user_id: z.coerce.number().int().positive().optional().nullable(),
	expected_cash_revenue: z.coerce.number().min(0).optional().nullable(),
	actual_cash_reported: z.coerce.number().min(0).optional().nullable(),
	status: z.string().optional().nullable(),
});

export type UpdateCashierReconciliationInput = z.infer<typeof UpdateCashierReconciliationSchema>;
