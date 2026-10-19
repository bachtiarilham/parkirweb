import { z } from "zod";

export const CreateSessionSchema = z.object({
	identity: z.string().min(3, "Username atau email minimal 3 karakter"),
	password: z.string().min(4, "Password minimal 4 karakter"),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

export const LoginSchema = z.object({
	username: z
		.string()
		.min(3, "Username minimal 3 karakter")
		.max(50, "Username maksimal 50 karakter"),
	password: z
		.string()
		.min(4, "Password minimal 4 karakter")
		.max(255, "Password maksimal 255 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
	identity: z.string().min(3, "Username atau email wajib diisi"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
