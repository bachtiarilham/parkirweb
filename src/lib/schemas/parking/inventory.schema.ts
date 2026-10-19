import { z } from "zod";

export const CreateSlotsInventorySchema = z.object({
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	vehicle_type: z.string().min(1, "Jenis kendaraan wajib diisi"),
	date: z.string().min(10, "Format tanggal YYYY-MM-DD wajib diisi"),
	total_slots: z.coerce.number().int().min(0, "Total slot tidak boleh negatif"),
	total_reserved: z.coerce.number().int().min(0).default(0),
});

export type CreateSlotsInventoryInput = z.infer<typeof CreateSlotsInventorySchema>;

export const UpdateSlotsInventorySchema = z.object({
	vehicle_type: z.string().optional().nullable(),
	date: z.string().optional().nullable(),
	total_slots: z.coerce.number().int().min(0).optional().nullable(),
	total_reserved: z.coerce.number().int().min(0).optional().nullable(),
});

export type UpdateSlotsInventoryInput = z.infer<typeof UpdateSlotsInventorySchema>;
