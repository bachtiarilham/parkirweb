import { z } from "zod";

export const LoginSchema = z.object({
	identity: z
		.string()
		.min(3, "Identity minimal 3 karakter")
		.max(50, "Identity maksimal 50 karakter"),
	password: z
		.string()
		.min(4, "Password minimal 4 karakter")
		.max(255, "Password maksimal 255 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter").max(100),
	email: z.string().email("Format email tidak valid"),
	username: z
		.string()
		.min(3, "Username minimal 3 karakter")
		.max(50, "Username maksimal 50 karakter"),
	password: z.string().min(6, "Password minimal 6 karakter").max(255),
	role: z.enum(["system", "tenant", "branch", "admin"]).default("admin"),
	tenantId: z.string().optional().nullable(),
	branchId: z.string().optional().nullable(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;