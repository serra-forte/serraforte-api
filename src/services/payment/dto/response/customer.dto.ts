import { z } from 'zod';

export const CustomerSchema = z.object({
    id: z.string(),
    name: z.string(),
    cpfCnpj: z.string(),
    phone: z.string(),
    email: z.string()
})

export type Customer = z.infer<typeof CustomerSchema>;
