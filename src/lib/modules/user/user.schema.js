import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const userBaseSchema = z.object({
	name: z.string().min(1, "Nome obrigatório"),
	email: z.email("Email inválido"),
});

export const createUserSchema = userBaseSchema.extend({
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const userResponseSchema = userBaseSchema.extend({
	id: idSchema,
});
