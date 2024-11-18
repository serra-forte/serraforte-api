import { makeListReviews } from '@/usecases/factories/reviews/make-list-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListReviews(request: FastifyRequest, reply:FastifyReply){
    try {
        const reviewsSchema = z.object({
            page: z.coerce.number().optional().default(1),
        })

        const { 
            page,
        } = reviewsSchema.parse(request.query)

        const listReviewsUseCase = await makeListReviews()
        
        const reviews = await listReviewsUseCase.execute({
            page,
            role: request.user.role,
            userId: request.user.id
        })
        return reply.status(200).send(reviews)
        
        } catch (error) {
        throw error
        }
}
    
