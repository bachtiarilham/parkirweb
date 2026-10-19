import { z } from "zod";

export const CreateGateSchema = z.object({
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	gate_name: z.string().min(2, "Nama gerbang minimal 2 karakter").max(50),
	gate_type: z.enum(["IN", "OUT", "BIDIRECTIONAL"]).default("IN"),
	status: z.string().default("ACTIVE"),
	hardware_ip: z.string().min(7, "IP address hardware tidak valid"),
});

export type CreateGateInput = z.infer<typeof CreateGateSchema>;

export const UpdateGateSchema = z.object({
	branch_id: z.coerce.number().int().positive().optional().nullable(),
	tenant_id: z.coerce.number().int().positive().optional().nullable(),
	gate_code: z.string().optional().nullable(),
	gate_name: z.string().min(2).max(50).optional().nullable(),
	gate_type: z.enum(["IN", "OUT", "BIDIRECTIONAL"]).optional().nullable(),
	status: z.string().optional().nullable(),
	hardware_ip: z.string().optional().nullable(),
});

export type UpdateGateInput = z.infer<typeof UpdateGateSchema>;
