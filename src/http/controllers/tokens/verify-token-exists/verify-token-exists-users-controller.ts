import { makeVerifyTokenExists } from '@/usecases/factories/tokens/make-verify-token-exists-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function VerifyTokenExists(request: FastifyRequest, reply:FastifyReply){
  try {
    const tokenQuerySchema = z.object({
      token: z.string(),
    })
    const { token } = tokenQuerySchema.parse(request.params)
  
    const verifyTokenIsValidUseCase = await makeVerifyTokenExists()
  
    const isTokenValid = await verifyTokenIsValidUseCase.execute({
      token,
    })
  
    return reply.status(200).send(isTokenValid)
  } catch (error) {
    throw error
  }
}
