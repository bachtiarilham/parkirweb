import { z } from "zod";

export const CreateBankReconciliationSchema = z.object({
	payment_order_code: z.string().min(1, "Payment order code wajib diisi"),
	psp_reference_id: z.string().optional().nullable(),
	internal_amount: z.coerce.number().min(0),
	external_amount: z.coerce.number().min(0).optional().nullable(),
	status: z.string().default("MATCHED"),
	reconciled_at: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	estimated_pg_fee: z.coerce.number().min(0).default(0),
	actual_pg_fee: z.coerce.number().min(0).optional().nullable(),
});

export type CreateBankReconciliationInput = z.infer<typeof CreateBankReconciliationSchema>;

export const UpdateBankReconciliationSchema = z.object({
	payment_order_code: z.string().optional().nullable(),
	psp_reference_id: z.string().optional().nullable(),
	internal_amount: z.coerce.number().min(0).optional().nullable(),
	external_amount: z.coerce.number().min(0).optional().nullable(),
	status: z.string().optional().nullable(),
	reconciled_at: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	estimated_pg_fee: z.coerce.number().min(0).optional().nullable(),
	actual_pg_fee: z.coerce.number().min(0).optional().nullable(),
});

export type UpdateBankReconciliationInput = z.infer<typeof UpdateBankReconciliationSchema>;
