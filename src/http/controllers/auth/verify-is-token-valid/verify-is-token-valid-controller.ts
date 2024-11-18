import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeVerifyTokenValid } from '@/usecases/factories/auth/verify-is-token-valid-usecase'

export async function VerifyTokenIsValid(request: FastifyRequest, reply:FastifyReply){
        try {
            const tokenSchema = z.object({
                token: z.coerce.string(),
            })
              const {
                token
              } = tokenSchema.parse(request.query)
             
            const verifyTokenIsValidUseCase = await makeVerifyTokenValid()
            
            const isTokenValid = await verifyTokenIsValidUseCase.execute({
               accessToken: token
            })
            return reply.status(200).send(isTokenValid)
            
          } catch (error) {
            throw error
          }
}
    
