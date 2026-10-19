import { z } from "zod";

export const CreatePromoSchema = z.object({
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	code: z.string().min(3, "Kode promo minimal 3 karakter").max(50),
	description: z.string().optional().nullable(),
	discount_type: z.enum(["PERCENT", "FLAT", "FIXED"]).default("PERCENT"),
	discount_value: z.coerce.number().positive("Nilai diskon harus lebih dari 0"),
	max_discount: z.coerce.number().optional().nullable(),
	min_purchase: z.coerce.number().optional().nullable(),
	start_date: z.string().min(10, "Tanggal mulai wajib diisi"),
	end_date: z.string().min(10, "Tanggal berakhir wajib diisi"),
	usage_limit: z.coerce.number().int().positive().default(100),
	target_rules: z.string().optional().nullable(),
});

export type CreatePromoInput = z.infer<typeof CreatePromoSchema>;

export const UpdatePromoSchema = z.object({
	code: z.string().min(3).max(50).optional().nullable(),
	description: z.string().optional().nullable(),
	discount_type: z.enum(["PERCENT", "FLAT", "FIXED"]).optional().nullable(),
	discount_value: z.coerce.number().positive().optional().nullable(),
	max_discount: z.coerce.number().optional().nullable(),
	min_purchase: z.coerce.number().optional().nullable(),
	start_date: z.string().optional().nullable(),
	end_date: z.string().optional().nullable(),
	usage_limit: z.coerce.number().int().positive().optional().nullable(),
	target_rules: z.string().optional().nullable(),
});

export type UpdatePromoInput = z.infer<typeof UpdatePromoSchema>;
