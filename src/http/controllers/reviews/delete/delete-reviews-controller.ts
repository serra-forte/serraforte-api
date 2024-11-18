import { makeDeleteReviews } from '@/usecases/factories/reviews/make-delete-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteReviews(request: FastifyRequest, reply:FastifyReply){
        try {
            const reviewsSchema = z.object({
                productId: z.string().uuid(),
            })

            const { 
                productId,
            } = reviewsSchema.parse(request.params)

            const deleteReviewsUseCase = await makeDeleteReviews()
            
            await deleteReviewsUseCase.execute({
                productId,
                userId: request.user.id,
            })
            return reply.status(200).send({message: "Avaliação deletada com sucesso"})
            
          } catch (error) {
            throw error
          }
}
    
