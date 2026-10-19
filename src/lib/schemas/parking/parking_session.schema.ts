import { z } from "zod";

export const CreateParkingSessionSchema = z.object({
	code: z.string().optional().nullable(),
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	gate_in_id: z.coerce.number().int().positive().optional().nullable(),
	gate_out_id: z.coerce.number().int().positive().optional().nullable(),
	officer_user_id: z.coerce.number().int().positive("Officer User ID wajib diisi"),
	plate_number: z.string().min(3, "Nomor plat minimal 3 karakter").max(20),
	vehicle_type: z.enum(["CAR", "MOTORCYCLE", "TRUCK", "BUS"]).default("CAR"),
	check_in_time: z.string().optional().nullable(),
	status: z.enum(["ACTIVE", "PENDING", "PAID", "COMPLETED"]).default("ACTIVE"),
	amount: z.coerce.number().min(0).default(0),
	payment_method: z.string().optional().nullable(),
	payment_order_id: z.string().optional().nullable(),
	metadata: z.unknown().optional().nullable(),
});

export type CreateParkingSessionInput = z.infer<typeof CreateParkingSessionSchema>;

export const UpdateParkingSessionSchema = z.object({
	gate_out_id: z.coerce.number().int().positive().optional().nullable(),
	check_out_time: z.string().optional().nullable(),
	duration_minutes: z.coerce.number().int().optional().nullable(),
	amount: z.coerce.number().min(0).optional().nullable(),
	status: z.enum(["ACTIVE", "PENDING", "PAID", "COMPLETED", "CANCELLED"]).optional().nullable(),
	payment_order_id: z.string().optional().nullable(),
	metadata: z.unknown().optional().nullable(),
});

export type UpdateParkingSessionInput = z.infer<typeof UpdateParkingSessionSchema>;
