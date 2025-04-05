import { makeShipmentCalculate } from '@/usecases/factories/deliveries/melhor-envio/make-shipment-calculate-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ShipmentCalculate(request: FastifyRequest, reply:FastifyReply){
    try {
        const querySchema = z.object({
            to: z.string(),
        })

        const { 
            to,
         } = querySchema.parse(request.query)

       
        const authenticateMelhorEnvioUseCase = await makeShipmentCalculate()
        
        const freights = await authenticateMelhorEnvioUseCase.execute({
            to,
        })
        
        return reply.status(200).send(freights)
        
        } catch (error) {
        throw error
    }
}
    
