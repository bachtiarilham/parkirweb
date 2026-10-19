import { z } from "zod";

export const CreateShiftSchema = z.object({
	code: z.string().optional().nullable(),
	user_id: z.coerce.number().int().positive("User ID wajib diisi"),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	start_time: z.string().default(() => new Date().toISOString()),
	cash_float_start: z.coerce.number().min(0).default(0),
	cash_collected: z.coerce.number().min(0).default(0),
	status: z.enum(["OPEN", "CLOSED", "BALANCED", "UNBALANCED"]).default("OPEN"),
});

export type CreateShiftInput = z.infer<typeof CreateShiftSchema>;

export const UpdateShiftSchema = z.object({
	end_time: z.string().optional().nullable(),
	cash_collected: z.coerce.number().min(0).optional().nullable(),
	status: z.enum(["OPEN", "CLOSED", "BALANCED", "UNBALANCED"]).optional().nullable(),
});

export type UpdateShiftInput = z.infer<typeof UpdateShiftSchema>;
