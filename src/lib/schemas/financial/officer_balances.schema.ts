import { z } from "zod";

export const CreateOfficerBalanceSchema = z.object({
	officer_user_id: z.coerce.number().int().positive("Officer User ID wajib diisi"),
	withdrawable_balance: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
	total_revenue_lifetime: z.coerce.number().min(0, "Revenue tidak boleh negatif"),
});

export type CreateOfficerBalanceInput = z.infer<typeof CreateOfficerBalanceSchema>;

export const UpdateOfficerBalanceSchema = z.object({
	officer_user_id: z.coerce.number().int().positive().optional().nullable(),
	withdrawable_balance: z.coerce.number().min(0).optional().nullable(),
	total_revenue_lifetime: z.coerce.number().min(0).optional().nullable(),
});

export type UpdateOfficerBalanceInput = z.infer<typeof UpdateOfficerBalanceSchema>;
