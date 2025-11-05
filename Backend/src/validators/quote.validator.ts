import { z } from 'zod';

export const createQuoteSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().min(10, 'Telefone inválido'),
    vehicle: z.string().min(3, 'Modelo do veículo é obrigatório'),
    equipment: z.string().min(10, 'Descrição do equipamento é obrigatória'),
    serviceId: z.string().uuid('ID do serviço inválido').optional(),
    message: z.string().optional(),
  }),
});

export const updateQuoteSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    status: z.enum(['NEW', 'ANALYZING', 'QUOTE_SENT', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
    estimatedValue: z.number().positive().optional(),
    notes: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
  }),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>['body'];
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>['body'];
