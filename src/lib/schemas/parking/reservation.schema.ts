import { z } from "zod";

export const CreateReservationSchema = z.object({
	code: z.string().optional().nullable(),
	user_id: z.coerce.number().int().positive("User ID wajib diisi"),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	vehicle_type: z.enum(["CAR", "MOTORCYCLE", "TRUCK", "BUS"]).default("CAR"),
	start_date: z.string().min(10, "Tanggal mulai wajib diisi"),
	end_date: z.string().min(10, "Tanggal berakhir wajib diisi"),
	status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"]).default("PENDING"),
	payment_order_id: z.string().optional().nullable(),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

export const UpdateReservationSchema = z.object({
	vehicle_type: z.enum(["CAR", "MOTORCYCLE", "TRUCK", "BUS"]).optional().nullable(),
	start_date: z.string().optional().nullable(),
	end_date: z.string().optional().nullable(),
	status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"]).optional().nullable(),
	payment_order_id: z.string().optional().nullable(),
});

export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>;
