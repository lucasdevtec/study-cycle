import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z.object({
	name: z.string().min(1, "Nome obrigatório"),
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const googleLoginSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
	providerId: z.string(),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
	token: z.string().min(1, "Token obrigatório"),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});
