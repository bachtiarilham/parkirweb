import { z } from "zod";

export const CreateBranchSchema = z.object({
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	branch_name: z.string().min(2, "Nama cabang minimal 2 karakter").max(100),
	zona: z.enum(["BLUECHIP", "NORMAL", "MURAH"]).default("NORMAL"),
	address: z.string().optional().nullable(),
	latitude: z.coerce.number().optional().nullable(),
	longitude: z.coerce.number().optional().nullable(),
	branch_type: z.string().default("STANDALONE"),
	status: z.string().default("ACTIVE"),
	platform_commission_rate: z.coerce.number().default(0),
	tax_rate: z.coerce.number().default(0),
	officer_commission_rate: z.coerce.number().default(0),
	branch_commission_rate: z.coerce.number().default(0),
});

export type CreateBranchInput = z.infer<typeof CreateBranchSchema>;

export const UpdateBranchSchema = z.object({
	tenant_id: z.coerce.number().int().positive().optional().nullable(),
	branch_name: z.string().min(2).max(100).optional().nullable(),
	zona: z.enum(["BLUECHIP", "NORMAL", "MURAH"]).optional().nullable(),
	address: z.string().optional().nullable(),
	latitude: z.coerce.number().optional().nullable(),
	longitude: z.coerce.number().optional().nullable(),
	branch_type: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	platform_commission_rate: z.coerce.number().optional().nullable(),
	tax_rate: z.coerce.number().optional().nullable(),
	officer_commission_rate: z.coerce.number().optional().nullable(),
	branch_commission_rate: z.coerce.number().optional().nullable(),
});

export type UpdateBranchInput = z.infer<typeof UpdateBranchSchema>;
