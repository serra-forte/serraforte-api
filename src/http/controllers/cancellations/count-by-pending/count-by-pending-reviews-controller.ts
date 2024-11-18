import { makeCountByPending } from '@/usecases/factories/cancellations/make-count-by-pending-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function CountByPending(request: FastifyRequest, reply:FastifyReply){
    try {
        const countByPendingUseCase = await makeCountByPending()
        
        const reviews = await countByPendingUseCase.execute({
            role: request.user.role,
            userId: request.user.id
        })
        return reply.status(200).send(reviews)
        
        } catch (error) {
        throw error
        }
}
    
