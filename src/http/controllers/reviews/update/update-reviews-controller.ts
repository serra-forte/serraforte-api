import { makeUpdateReviews } from '@/usecases/factories/reviews/make-update-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateReviews(request: FastifyRequest, reply:FastifyReply){
        try {
            const reviewsSchema = z.object({
                productId: z.string().uuid(),
                userId: z.string().uuid(),
                comment: z.string().optional().nullable(),
                rating: z.number().nonnegative(),
            })

            const { 
                productId,
                userId,
                comment,
                rating
            } = reviewsSchema.parse(request.body)

            const updateReviewsUseCase = await makeUpdateReviews()
            
            const reviews = await updateReviewsUseCase.execute({
                productId,
                userId,
                comment,
                rating
            })
            return reply.status(200).send(reviews)
            
          } catch (error) {
            throw error
          }
}
    
