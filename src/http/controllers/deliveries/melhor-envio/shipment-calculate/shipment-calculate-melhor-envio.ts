import { makeShipmentCalculate } from '@/usecases/factories/deliveries/melhor-envio/make-shipment-calculate-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ShipmentCalculate(request: FastifyRequest, reply:FastifyReply){
    try {
        const querySchema = z.object({
            to: z.string(),
        })

        const bodySchema = z.object({
            shopkeeperIds: z.array(z.string()),
            productsId: z.array(z.string()),
        })

        const { 
            to,
         } = querySchema.parse(request.query)

        const { 
            shopkeeperIds,
            productsId
         } = bodySchema.parse(request.body)

        const authenticateMelhorEnvioUseCase = await makeShipmentCalculate()
        
        const authenticateURL = await authenticateMelhorEnvioUseCase.execute({
            to,
            shopkeeperIds,
            productsId
        })
        
        return reply.status(200).send({authenticateURL})
        
        } catch (error) {
        throw error
    }
}
    
