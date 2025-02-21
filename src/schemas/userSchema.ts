import { z } from 'zod';
import { passwordSchema } from './basicShema';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  name: z.string().min(6, 'Nome deve ter pelo menos 6 caracteres'),
  password: passwordSchema,
  horasCiclo: z.number().min(10, 'Precisa de ao menos 10 horas').optional().default(20),
});

export const editSchema = z.object({
  email: z.string().email('E-mail inválido').optional(),
  name: z.string().min(6, 'Nome deve ter pelo menos 6 caracteres').optional(),
  horasCiclo: z.number().min(10, 'Precisa de ao menos 10 horas').default(20).optional(),
});
