import { z } from "zod";

export const CreateAdSchema = z.object({
	title: z.string().min(1, "Judul iklan wajib diisi").max(255),
	tenant_id: z.string().min(1, "Tenant ID wajib diisi"),
	image_url: z.string().url("URL gambar tidak valid").optional().nullable(),
	target_url: z.string().url("Target URL tidak valid").optional().nullable(),
	status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export type CreateAdInput = z.infer<typeof CreateAdSchema>;

export const UpdateAdSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	tenant_id: z.string().optional(),
	image_url: z.string().url().optional().nullable(),
	target_url: z.string().url().optional().nullable(),
	status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
});

export type UpdateAdInput = z.infer<typeof UpdateAdSchema>;

export const RecordAdClickSchema = z.object({
	ad_id: z.string().min(1, "Ad ID wajib diisi"),
	user_id: z.number().int().positive().optional().nullable(),
	branch_id: z.number().int().positive().optional().nullable(),
});

export type RecordAdClickInput = z.infer<typeof RecordAdClickSchema>;
