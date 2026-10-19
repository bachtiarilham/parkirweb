import { z } from "zod";

export const CreateTenantPlanSchema = z.object({
	member_tenant_plan_code: z.string().min(2, "Kode plan wajib diisi"),
	member_tenant_plan_name: z.string().min(2, "Nama paket organisasi wajib diisi"),
	price_per_month: z.coerce.number().min(0, "Harga per bulan tidak boleh negatif"),
	max_branches: z.coerce.number().int().positive("Maksimal cabang minimal 1"),
	max_gates: z.coerce.number().int().positive("Maksimal gerbang minimal 1"),
	features: z.unknown().optional().nullable(),
	is_active: z.boolean().default(true),
});

export type CreateTenantPlanInput = z.infer<typeof CreateTenantPlanSchema>;

export const UpdateTenantPlanSchema = z.object({
	member_tenant_plan_name: z.string().min(2).optional().nullable(),
	price_per_month: z.coerce.number().min(0).optional().nullable(),
	max_branches: z.coerce.number().int().positive().optional().nullable(),
	max_gates: z.coerce.number().int().positive().optional().nullable(),
	features: z.unknown().optional().nullable(),
	is_active: z.boolean().optional().nullable(),
});

export type UpdateTenantPlanInput = z.infer<typeof UpdateTenantPlanSchema>;
