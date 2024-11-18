import { makeFindCategory } from '@/usecases/factories/categories/make-find-by-id-categories-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindCategory(request: FastifyRequest, reply:FastifyReply){
        try {
            const categorySchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = categorySchema.parse(request.params)

            const findCategoryUseCase = await makeFindCategory()
            
            const category = await findCategoryUseCase.execute({
                id,
            })
            return reply.status(200).send(category)
            
          } catch (error) {
            throw error
          }
}
    
