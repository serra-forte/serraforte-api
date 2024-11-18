import { makeFindCancellation } from '@/usecases/factories/cancellations/make-find-by-id-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindCancellation(request: FastifyRequest, reply:FastifyReply){
    try {
        const cancellationSchema = z.object({
            id: z.string().uuid(),
        })

        const { 
            id,
        } = cancellationSchema.parse(request.params)

        const findCancellationUseCase = await makeFindCancellation()
        
        const cancellation = await findCancellationUseCase.execute({
            id,
        })
        return reply.status(200).send(cancellation)
        
        } catch (error) {
        throw error
    }
}
    
