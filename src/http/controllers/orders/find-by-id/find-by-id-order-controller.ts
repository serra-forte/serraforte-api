import { makeFindOrderById } from '@/usecases/factories/orders/make-find-by-id-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindOrderById(request: FastifyRequest, reply:FastifyReply){
        try {
            const userParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = userParams.parse(request.params)
            const findOrderUseCase = await makeFindOrderById()
            
            const order = await findOrderUseCase.execute({
                id
            })
            
            return reply.status(200).send(order)
            
          } catch (error) {
            throw error
          }
}
    
