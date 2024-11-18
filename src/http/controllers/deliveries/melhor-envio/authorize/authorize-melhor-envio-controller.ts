import { makeAuthorize } from '@/usecases/factories/deliveries/melhor-envio/make-authorize-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function Authorize(request: FastifyRequest, reply:FastifyReply){
    try {
        const authorizeMelhorEnvioUseCase = await makeAuthorize()
        
        const authorizeURL = await authorizeMelhorEnvioUseCase.execute()
        
        return reply.status(200).send({authorizeURL})
        
        } catch (error) {
        throw error
    }
}
    
