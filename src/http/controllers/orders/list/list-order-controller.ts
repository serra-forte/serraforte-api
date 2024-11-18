import { makeListOrder } from '@/usecases/factories/orders/make-list-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListOrder(request: FastifyRequest, reply:FastifyReply){
        try {
          const querySchema = z.object({
            page: z.coerce.number().optional().default(1),
          })

          const { page } = querySchema.parse(request.query)

            const listOrderUseCase = await makeListOrder()
            
            const orders = await listOrderUseCase.execute({
                page
            })
            return reply.status(200).send(orders)
            
          } catch (error) {
            throw error
          }
}

    
