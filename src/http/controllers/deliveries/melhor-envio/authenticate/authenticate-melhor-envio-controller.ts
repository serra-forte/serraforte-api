import { makeAuthenticate } from '@/usecases/factories/deliveries/melhor-envio/make-authenticate-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function Authenticate(request: FastifyRequest, reply:FastifyReply){
    try {
        const querySchema = z.object({
            code: z.string(),
        })

        const { code } = querySchema.parse(request.query)

        const authenticateMelhorEnvioUseCase = await makeAuthenticate()
        
        const authenticateURL = await authenticateMelhorEnvioUseCase.execute({
            code
        })
        
        return reply.status(200).send({authenticateURL})
        
        } catch (error) {
        throw error
    }
}
    
