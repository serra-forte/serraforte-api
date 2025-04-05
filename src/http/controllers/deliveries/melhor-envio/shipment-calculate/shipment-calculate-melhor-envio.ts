import { makeShipmentCalculate } from '@/usecases/factories/deliveries/melhor-envio/make-shipment-calculate-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ShipmentCalculate(request: FastifyRequest, reply:FastifyReply){
    try {
        const querySchema = z.object({
            to: z.string(),
        })

        const bodySchema = z.object({
            products: z.array(z.object({
                id: z.string(),
                quantity: z.number(),
                height: z.number(),
                width: z.number(),
                weight: z.number(),
                length: z.number(),
            }))
        })

        const { 
            to,
         } = querySchema.parse(request.query)
        
        const {products} = bodySchema.parse(request.body)

       
        const authenticateMelhorEnvioUseCase = await makeShipmentCalculate()
        
        const freights = await authenticateMelhorEnvioUseCase.execute({
            to,
            products
        })
        
        return reply.status(200).send(freights)
        
        } catch (error) {
        throw error
    }
}
    
