import { makeCreateCancellation } from '@/usecases/factories/cancellations/make-create-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function Cancellation(request: FastifyRequest, reply:FastifyReply){
  try {
    const cancellationQuerySchema = z.object({
      orderId: z.string().uuid(),
      message: z.string(),
      imageUrl: z.string().optional().nullable(),
      shopkeeperId: z.string().uuid(),
      reason: z.string(),
    })
    const { 
      orderId,
      message,
      imageUrl,
      shopkeeperId,
      reason
    } = cancellationQuerySchema.parse(request.body)
  
    const cancellationUseCase = await makeCreateCancellation()
  
    const cancellation = await cancellationUseCase.execute({
      orderId,
      userId: request.user.id,
      message,
      imageUrl,
      shopkeeperId,
      reason,
    })
  
    return reply.status(200).send(cancellation)
  } catch (error) {
    throw error
  }
}
