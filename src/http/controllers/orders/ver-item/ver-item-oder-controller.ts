import { makeVerItemOrder } from '@/usecases/factories/orders/item/make-ver-item-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function VerItem(request: FastifyRequest, reply:FastifyReply){
        try {
            const userParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = userParams.parse(request.params)
            const verItemOrderUseCase = await makeVerItemOrder()
            
            const order = await verItemOrderUseCase.execute({
                id
            })
            
            return reply.status(200).send(order)
            
          } catch (error) {
            throw error
          }
}
    
