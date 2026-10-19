import { z } from "zod";

export const CreateTariffSchema = z.object({
	tariff_code: z.string().min(2, "Kode tarif wajib diisi"),
	tenant_id: z.coerce.number().int().positive("Tenant ID wajib diisi"),
	branch_id: z.coerce.number().int().positive("Branch ID wajib diisi"),
	vehicle_type: z.enum(["CAR", "MOTORCYCLE", "TRUCK", "BUS"]).default("CAR"),
	base_fare: z.coerce.number().min(0, "Tarif dasar tidak boleh negatif"),
	hourly_fare: z.coerce.number().min(0, "Tarif per jam tidak boleh negatif"),
	grace_period_minutes: z.coerce.number().int().min(0).default(10),
	rules_config: z.unknown().optional().nullable(),
	is_active: z.boolean().default(true),
});

export type CreateTariffInput = z.infer<typeof CreateTariffSchema>;

export const UpdateTariffSchema = z.object({
	base_fare: z.coerce.number().min(0).optional().nullable(),
	hourly_fare: z.coerce.number().min(0).optional().nullable(),
	grace_period_minutes: z.coerce.number().int().min(0).optional().nullable(),
	rules_config: z.unknown().optional().nullable(),
	is_active: z.boolean().optional().nullable(),
});

export type UpdateTariffInput = z.infer<typeof UpdateTariffSchema>;
