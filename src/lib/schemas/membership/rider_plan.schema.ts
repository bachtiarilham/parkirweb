import { z } from "zod";

export const CreateRiderPlanSchema = z.object({
	member_rider_plan_code: z.string().min(2, "Kode plan wajib diisi"),
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	member_rider_plan_name: z.string().min(2, "Nama paket langganan wajib diisi"),
	member_rider_plan_price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
	duration_days: z.coerce.number().int().positive("Durasi hari harus lebih dari 0"),
	vehicle_limit: z.coerce.number().int().min(1).default(1),
	is_active: z.boolean().default(true),
});

export type CreateRiderPlanInput = z.infer<typeof CreateRiderPlanSchema>;

export const UpdateRiderPlanSchema = z.object({
	member_rider_plan_name: z.string().min(2).optional().nullable(),
	member_rider_plan_price: z.coerce.number().min(0).optional().nullable(),
	duration_days: z.coerce.number().int().positive().optional().nullable(),
	vehicle_limit: z.coerce.number().int().min(1).optional().nullable(),
	is_active: z.boolean().optional().nullable(),
});

export type UpdateRiderPlanInput = z.infer<typeof UpdateRiderPlanSchema>;
