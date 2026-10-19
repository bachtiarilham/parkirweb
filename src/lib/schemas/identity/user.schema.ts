import { z } from "zod";

export const UserRoleSchema = z.enum(["system", "tenant", "branch", "admin"]);

export const CreateUserSchema = z.object({
	full_name: z.string().min(2, "Nama minimal 2 karakter").max(100),
	email: z.string().email("Format email tidak valid"),
	username: z
		.string()
		.min(3, "Username minimal 3 karakter")
		.max(50, "Username maksimal 50 karakter"),
	password: z
		.string()
		.min(6, "Password minimal 6 karakter")
		.max(255),
	phone: z.string().min(8, "Nomor telepon minimal 8 digit"),
	nik: z.string().optional(),
	role: UserRoleSchema.default("admin"),
	tenantId: z.string().optional().nullable(),
	branchId: z.string().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
	user_id: z.coerce.number().int().positive().optional(),
	full_name: z.string().min(2).max(100).optional().nullable(),
	email: z.string().email().optional().nullable(),
	username: z.string().min(3).max(50).optional(),
	password: z.string().min(6).max(255).optional().or(z.literal("")),
	phone_number: z.string().optional().nullable(),
	nik: z.string().optional().nullable(),
	photo_url: z.string().url().optional().nullable(),
	role: UserRoleSchema.optional(),
	tenantId: z.string().optional().nullable(),
	branchId: z.string().optional().nullable(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
