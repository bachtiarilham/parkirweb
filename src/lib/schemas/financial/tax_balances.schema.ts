import { z } from "zod";

export const CreateTaxBalanceSchema = z.object({
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	withdrawable_balance: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
	total_revenue_lifetime: z.coerce.number().min(0, "Revenue tidak boleh negatif"),
});

export type CreateTaxBalanceInput = z.infer<typeof CreateTaxBalanceSchema>;

export const UpdateTaxBalanceSchema = z.object({
	branch_id: z.coerce.number().int().positive().optional().nullable(),
	withdrawable_balance: z.coerce.number().min(0).optional().nullable(),
	total_revenue_lifetime: z.coerce.number().min(0).optional().nullable(),
});

export type UpdateTaxBalanceInput = z.infer<typeof UpdateTaxBalanceSchema>;
