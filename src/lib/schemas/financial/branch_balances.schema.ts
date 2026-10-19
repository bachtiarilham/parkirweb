import { z } from "zod";

export const CreateBranchBalanceSchema = z.object({
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	withdrawable_balance: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
	total_revenue_lifetime: z.coerce.number().min(0, "Revenue tidak boleh negatif"),
});

export type CreateBranchBalanceInput = z.infer<typeof CreateBranchBalanceSchema>;

export const UpdateBranchBalanceSchema = z.object({
	branch_id: z.coerce.number().int().positive().optional().nullable(),
	withdrawable_balance: z.coerce.number().min(0).optional().nullable(),
	total_revenue_lifetime: z.coerce.number().min(0).optional().nullable(),
});

export type UpdateBranchBalanceInput = z.infer<typeof UpdateBranchBalanceSchema>;
