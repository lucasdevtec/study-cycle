import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(10, "A senha deve ter pelo menos 10 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  name: z.string().min(6, "Nome deve ter pelo menos 6 caracteres").optional(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  horasCiclo: z.number().min(10, "Precisa de ao menos 10 horas").optional(),
});
