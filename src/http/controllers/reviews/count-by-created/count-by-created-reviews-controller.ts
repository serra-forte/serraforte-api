import { makeCountByCreated } from '@/usecases/factories/reviews/make-count-by-created-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CountByCreated(request: FastifyRequest, reply:FastifyReply){
    try {
        const countByCreatedUseCase = await makeCountByCreated()
        
        const reviews = await countByCreatedUseCase.execute({
            role: request.user.role ?? null,
            userId: request.user.id
        })
        return reply.status(200).send(reviews)
        
        } catch (error) {
        throw error
        }
}
    
