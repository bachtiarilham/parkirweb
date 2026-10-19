import { z } from "zod";

export const CreateOrderSchema = z.object({
	payment_order_code: z.string().optional(),
	trx_code: z.string().optional().nullable(),
	buyer_account_id: z.coerce.number().int().positive().optional().nullable(),
	seller_account_id: z.coerce.number().int().positive("Seller account ID wajib diisi"),
	amount: z.coerce.number().positive("Amount harus lebih besar dari 0"),
	currency: z.string().default("IDR"),
	status: z.string().default("PENDING"),
	tax_rate: z.coerce.number().default(0),
	tax_amount: z.coerce.number().default(0),
	platform_commission_rate: z.coerce.number().default(0),
	platform_share_amount: z.coerce.number().default(0),
	tenant_commission_rate: z.coerce.number().default(0),
	tenant_share_amount: z.coerce.number().default(0),
	officer_commission_rate: z.coerce.number().default(0),
	officer_share_amount: z.coerce.number().default(0),
	officer_user_id: z.coerce.number().int().positive().optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderSchema = z.object({
	status: z.string().optional().nullable(),
	ledger_updated: z.boolean().optional().nullable(),
	reference_code: z.string().optional().nullable(),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
