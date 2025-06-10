import { z } from 'zod';

export const CustomerSchema = z.object({
    name: z.string(),
    cpf: z.string(),
    phone: z.string(),
    email: z.string()
})

export type Customer = z.infer<typeof CustomerSchema>;
