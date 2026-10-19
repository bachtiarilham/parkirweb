import { z } from "zod";

export const CreateTenantSchema = z.object({
	code: z.string().optional().nullable(),
	name: z.string().min(2, "Nama tenant minimal 2 karakter").max(100),
	bank_name: z.string().min(2, "Nama bank wajib diisi"),
	bank_account_number: z.string().min(5, "Nomor rekening wajib diisi"),
	bank_account_name: z.string().min(2, "Nama pemilik rekening wajib diisi"),
	package_active: z.string().default("BASIC"),
	status: z.enum(["ACTIVE", "INACTIVE", "REVOKED"]).default("ACTIVE"),
	platform_commission_rate: z.coerce.number().default(0),
	tenant_commission_rate: z.coerce.number().default(0),
	tax_rate: z.coerce.number().default(0),
});

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;

export const UpdateTenantSchema = z.object({
	tenant_code: z.string().optional().nullable(),
	tenant_name: z.string().min(2).max(100).optional().nullable(),
	bank_name: z.string().optional().nullable(),
	bank_account_number: z.string().optional().nullable(),
	bank_account_name: z.string().optional().nullable(),
	package_active: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	platform_commission_rate: z.coerce.number().optional().nullable(),
	tax_rate: z.coerce.number().optional().nullable(),
	tenant_commission_rate: z.coerce.number().optional().nullable(),
	expired_at: z.string().optional().nullable(),
	revoked_at: z.string().optional().nullable(),
});

export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
