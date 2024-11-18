import { makeConfirmShipment } from '@/usecases/factories/orders/make-confirm-shipment-order-uscase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ConfirmShipment(request: FastifyRequest, reply:FastifyReply){
        try {
            const orderParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = orderParams.parse(request.params)
            const confirmShipmentUseCase = await makeConfirmShipment()
            
            await confirmShipmentUseCase.execute({
                orderId: id
            })
            
            return reply.status(200).send({message: 'Status alterado para enviado com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
