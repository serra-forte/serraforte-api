import { makeFilterOrders } from '@/usecases/factories/orders/make-filter-orders-uscase'
import { Status } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { nullable, z } from 'zod'

export async function FilterOrder(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
              total: z.union([z.boolean(), z.string().transform(val => (val === '' ? undefined : val))])
                .nullable()
                .optional(),
              code: z.coerce.string().nullable().optional(),
              client: z.string().nullable().optional(),
              date: z.string().nullable().optional(),
              paymentStatus: z.string().nullable().optional(),
              status: z.string().nullable().optional(),
              page: z.coerce.number().optional().default(1),
            });

            const { 
                client,
                total,
                code,
                date,
                paymentStatus,
                status,
                page
             } = querySchema.parse(request.query)

            const createOrderUseCase = await makeFilterOrders()
            const orders = await createOrderUseCase.execute({
                client,
                total,
                code,
                date,
                page,
                paymentStatus,
                status: status?.toUpperCase() as Status
            })
            return reply.status(200).send(orders)
            
          } catch (error) {
            throw error
          }
}
    
