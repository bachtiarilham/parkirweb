import { z } from "zod";

export const CreateGateAlarmSchema = z.object({
	code: z.string().optional().nullable(),
	gate_id: z.coerce.number().int().positive("Gate ID wajib diisi"),
	triggered_at: z.string().optional().nullable(),
	handling_officer_id: z.coerce.number().int().positive().optional().nullable(),
});

export type CreateGateAlarmInput = z.infer<typeof CreateGateAlarmSchema>;

export const UpdateGateAlarmSchema = z.object({
	gate_id: z.coerce.number().int().positive().optional().nullable(),
	triggered_at: z.string().optional().nullable(),
	acknowledged_at: z.string().optional().nullable(),
	resolved_at: z.string().optional().nullable(),
	handling_officer_id: z.coerce.number().int().positive().optional().nullable(),
	latency_seconds: z.coerce.number().optional().nullable(),
});

export type UpdateGateAlarmInput = z.infer<typeof UpdateGateAlarmSchema>;
