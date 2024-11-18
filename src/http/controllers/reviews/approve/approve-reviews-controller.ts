import { makeApproveReviews } from '@/usecases/factories/reviews/make-approve-reviews-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ApproveReviews(request: FastifyRequest, reply:FastifyReply){
    try {
        const reviewsSchema = z.object({
            reviewId: z.string().uuid(),
            approved: z.string()
            .transform((val) => val.toLowerCase() === 'true')
            .pipe(z.boolean())
        })

        const { 
            reviewId,
            approved
        } = reviewsSchema.parse(request.query)

        const approveReviewsUseCase = await makeApproveReviews()

        await approveReviewsUseCase.execute({
            reviewId,
            approved
        })
        return reply.status(200).send({message: 'Avaliação alterada com sucesso'})
        
        } catch (error) {
        throw error
        }
}
    
