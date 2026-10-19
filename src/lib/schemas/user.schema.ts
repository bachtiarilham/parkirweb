import { z } from "zod";

export const UserRoleSchema = z.enum(["system", "tenant", "branch", "admin"]);

export const CreateUserSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter").max(100),
	email: z.string().email("Format email tidak valid"),
	username: z
		.string()
		.min(3, "Username minimal 3 karakter")
		.max(50, "Username maksimal 50 karakter"),
	password: z
		.string()
		.min(6, "Password minimal 6 karakter")
		.max(255)
		.optional(),
	role: UserRoleSchema,
	tenantId: z.string().optional().nullable(),
	branchId: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter").max(100).optional(),
	email: z.string().email("Format email tidak valid").optional(),
	username: z
		.string()
		.min(3, "Username minimal 3 karakter")
		.max(50, "Username maksimal 50 karakter")
		.optional(),
	password: z
		.string()
		.min(6, "Password minimal 6 karakter")
		.max(255)
		.optional()
		.or(z.literal("")),
	role: UserRoleSchema.optional(),
	tenantId: z.string().optional().nullable(),
	branchId: z.string().optional().nullable(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	phone: z.string().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
