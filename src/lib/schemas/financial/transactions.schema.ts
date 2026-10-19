import { z } from "zod";

export const CreateTransactionSchema = z.object({
	code: z.string().optional(),
	reference_code: z.string().optional().nullable(),
	metadata: z.string().optional().nullable(),
	type: z.enum(["PAYMENT", "REFUND", "TOPUP", "TRANSFER"]).default("PAYMENT"),
	amount: z.coerce.number().positive("Nominal transaksi harus lebih dari 0"),
	currency: z.string().default("IDR"),
	payment_method: z.string().min(1, "Metode pembayaran wajib dipilih"),
	status: z.string().default("PENDING"),
	snap_token: z.string().optional().nullable(),
	redirect_url: z.string().url().optional().nullable(),
	pg_fee: z.coerce.number().default(0),
	net_amount: z.coerce.number().default(0),
	created_at: z.string().default(() => new Date().toISOString()),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = z.object({
	status: z.string().optional().nullable(),
	payment_expiry: z.string().optional().nullable(),
	pg_fee: z.coerce.number().optional().nullable(),
	net_amount: z.coerce.number().optional().nullable(),
});

export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
