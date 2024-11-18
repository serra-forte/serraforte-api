import { makeCountBySent } from '@/usecases/factories/orders/make-count-by-sent-order-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function CountBySent(request: FastifyRequest, reply:FastifyReply){
    try {
        const countBySentUseCase = await makeCountBySent()
        
        const reviews = await countBySentUseCase.execute({
            role: request.user.role,
            userId: request.user.id
        })
        return reply.status(200).send(reviews)
        
        } catch (error) {
        throw error
        }
}
    
