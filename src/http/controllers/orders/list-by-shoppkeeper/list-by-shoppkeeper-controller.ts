import { makeListByShoppkeeper } from '@/usecases/factories/orders/make-list-by-shoppkeeper-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListByShoppkeeper(request: FastifyRequest, reply:FastifyReply){
        try {
          const querySchema = z.object({
            page: z.coerce.number().optional().default(1),
          })

          const { page } = querySchema.parse(request.query)

            const listOrderUseCase = await makeListByShoppkeeper()
            
            const orders = await listOrderUseCase.execute({
                userId: request.user.id,
                page
            })
            return reply.status(200).send(orders)
            
          } catch (error) {
            throw error
          }
}

    
