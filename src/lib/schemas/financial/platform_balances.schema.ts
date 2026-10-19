import { z } from "zod";

export const CreatePlatformBalanceSchema = z.object({
	withdrawable_balance: z.coerce.number().min(0, "Saldo tidak boleh negatif"),
	total_revenue_lifetime: z.coerce.number().min(0, "Revenue tidak boleh negatif"),
});

export type CreatePlatformBalanceInput = z.infer<typeof CreatePlatformBalanceSchema>;

export const UpdatePlatformBalanceSchema = z.object({
	withdrawable_balance: z.coerce.number().min(0).optional().nullable(),
	total_revenue_lifetime: z.coerce.number().min(0).optional().nullable(),
});

export type UpdatePlatformBalanceInput = z.infer<typeof UpdatePlatformBalanceSchema>;
