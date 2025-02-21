import { z } from 'zod';

export const stringSchema = z.string().min(6);
export const numberSchema = z.string();
export const emailSchema = z.string().email();
export const booleanSchema = z.boolean();
export const passwordSchema = z
  .string()
  .min(10, 'Senha deve ter pelo menos 6 caracteres')
  .refine((value) => /[A-Z]/.test(value), {
    message: 'A senha deve conter pelo menos uma letra maiúscula',
  })
  .refine((value) => /[0-9]/.test(value), {
    message: 'A senha deve conter pelo menos um número',
  });
