import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().min(10, 'Telefone inválido'),
    subject: z.string().optional(),
    message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
  }),
});

export type CreateContactInput = z.infer<typeof createContactSchema>['body'];
