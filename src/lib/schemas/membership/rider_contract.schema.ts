import { z } from "zod";

export const CreateRiderContractSchema = z.object({
	code: z.string().optional().nullable(),
	user_id: z.coerce.number().int().positive().optional().nullable(),
	plan_id: z.coerce.number().int().positive("Plan ID wajib diisi"),
	payment_order_code: z.string().optional().nullable(),
	rfid_card_no: z.string().min(4, "Nomor RFID card wajib diisi"),
	license_plates: z.string().min(3, "Plat nomor wajib diisi"),
	status: z.string().default("ACTIVE"),
	started_at: z.string().optional().nullable(),
	expires_at: z.string().optional().nullable(),
});

export type CreateRiderContractInput = z.infer<typeof CreateRiderContractSchema>;

export const UpdateRiderContractSchema = z.object({
	plan_id: z.coerce.number().int().positive().optional().nullable(),
	rfid_card_no: z.string().optional().nullable(),
	license_plates: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	expires_at: z.string().optional().nullable(),
});

export type UpdateRiderContractInput = z.infer<typeof UpdateRiderContractSchema>;
