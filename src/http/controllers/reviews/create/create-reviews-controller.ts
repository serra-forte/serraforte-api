import { makeCreateReviews } from '@/usecases/factories/reviews/make-create-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateReviews(request: FastifyRequest, reply:FastifyReply){
        try {
            const reviewsSchema = z.object({
                product: z.object({
                    id: z.string().uuid(),
                }),
                user: z.object({
                    id: z.string().uuid(),
                }),
                comment: z.string().optional().nullable(),
                rating: z.number().nonnegative(),
            })

            const { 
                product,
                user,
                comment,
                rating
            } = reviewsSchema.parse(request.body)

            const createReviewsUseCase = await makeCreateReviews()
            
            const reviews = await createReviewsUseCase.execute({
                productId: product.id,
                userId: user.id,
                comment,
                rating
            })
            return reply.status(200).send(reviews)
            
          } catch (error) {
            throw error
          }
}
    
