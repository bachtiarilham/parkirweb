import { z } from "zod";

export const CreateOfficerPresenceSchema = z.object({
	code: z.string().optional().nullable(),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	officer_user_id: z.coerce.number().int().positive("Officer User ID wajib diisi"),
	shift_id: z.coerce.number().int().positive("Shift ID wajib diisi"),
	clock_in_at: z.string().optional().nullable(),
	device_heartbeats_count: z.coerce.number().int().default(0),
	status: z.enum(["PRESENT", "ABSENT", "LATE"]).default("PRESENT"),
});

export type CreateOfficerPresenceInput = z.infer<typeof CreateOfficerPresenceSchema>;

export const UpdateOfficerPresenceSchema = z.object({
	clock_out_at: z.string().optional().nullable(),
	device_heartbeats_count: z.coerce.number().int().optional().nullable(),
	status: z.enum(["PRESENT", "ABSENT", "LATE", "COMPLETED"]).optional().nullable(),
});

export type UpdateOfficerPresenceInput = z.infer<typeof UpdateOfficerPresenceSchema>;
