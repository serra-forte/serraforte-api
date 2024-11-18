import { makeConfirmDelivery } from '@/usecases/factories/orders/make-confirm-delivery-order-uscase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ConfirmDelivery(request: FastifyRequest, reply:FastifyReply){
        try {
            const orderQuery = z.object({
                orderId: z.string().uuid(),
                receiverName: z.string().nullable().optional(),
                receiverDocument: z.string().nullable().optional(),
                longitude: z.coerce.number().nullable().optional(),
                latitude: z.coerce.number().nullable().optional(),
            })

            const { 
                orderId,
                receiverName,
                receiverDocument,
                longitude,
                latitude
            } = orderQuery.parse(request.query)
            const findOrderUseCase = await makeConfirmDelivery()
            
            await findOrderUseCase.execute({
                orderId,
                receiverName,
                receiverDocument,
                longitude,
                latitude
            })
            
            return reply.status(200).send({message: 'Status alterado para entregue com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
