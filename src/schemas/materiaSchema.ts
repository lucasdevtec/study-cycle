import { z } from 'zod';

export const createSchema = z.object({
  dificuldade: z.number().min(1, 'O valor mínimo é 1').max(5, 'O valor máximo é 5'),
  nome: z.string().min(6, 'Nome deve ter pelo menos 3 caracteres'),
  idUsuario: z.string().min(3, 'Id Usuário Inválida'),
  horasTotais: z.number().min(2, 'Precisa de ao menos 10 horas').optional(),
  horasConcluidas: z.number().optional(),
  incluso: z.boolean().optional().default(false),
});

export const editSchema = z.object({
  dificuldade: z.number().min(1, 'O valor mínimo é 1').max(5, 'O valor máximo é 5'),
  nome: z.string().min(6, 'Nome deve ter pelo menos 3 caracteres'),
  idUsuario: z.string().min(3, 'Id Usuário Inválida'),
  horasTotais: z.number().min(2, 'Precisa de ao menos 10 horas').optional(),
  horasConcluidas: z.number().optional(),
  incluso: z.boolean().optional().default(false),
});
