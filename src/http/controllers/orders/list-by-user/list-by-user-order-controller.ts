import { makeListOrderByUser } from '@/usecases/factories/orders/make-list-by-user-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListOrderByUser(request: FastifyRequest, reply:FastifyReply){
        try {
          const querySchema = z.object({
            page: z.coerce.number().optional().default(1),
          })

          const { page } = querySchema.parse(request.query)

            const listOrderUseCase = await makeListOrderByUser()
            
            const orders = await listOrderUseCase.execute({
                userId: request.user.id,
                page
            })
            
            return reply.status(200).send(orders)
            
          } catch (error) {
            throw error
          }
}
    
