import { makeFindByIdReviews } from '@/usecases/factories/reviews/make-find-by-id-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindByIdReviews(request: FastifyRequest, reply:FastifyReply){
    try {
        const reviewsSchema = z.object({
            reviewId: z.string().uuid(),
        })

        const { 
            reviewId,
        } = reviewsSchema.parse(request.params)

        const findByIdReviewsUseCase = await makeFindByIdReviews()
        
        const reviews = await findByIdReviewsUseCase.execute({
            reviewId,
        })
        return reply.status(200).send(reviews)
        
        } catch (error) {
        throw error
        }
}
    
