import { makeChangeStatusCancellation } from '@/usecases/factories/cancellations/make-change-status-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ChangeStatusCancellation(request: FastifyRequest, reply:FastifyReply){
    try {
        const cancellationSchema = z.object({
            cancellationId: z.string().uuid(),
            status: z.enum(['APPROVED', 'REPROVED']),
        })

        const { 
            cancellationId,
            status
        } = cancellationSchema.parse(request.query)

        const changestatusCancellationUseCase = await makeChangeStatusCancellation()
        
        const cancellation = await changestatusCancellationUseCase.execute({
            cancellationId,
            status
        })
        return reply.status(200).send(cancellation)
        
        } catch (error) {
        throw error
    }
}
    
