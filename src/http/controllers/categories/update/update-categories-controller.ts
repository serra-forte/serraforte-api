import { makeUpdateCategory } from '@/usecases/factories/categories/make-update-categories-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateCategory(request: FastifyRequest, reply:FastifyReply){
        try {
            const categorySchema = z.object({
                id: z.string().uuid(),
                name: z.string().min(4),
                description: z.string().optional(),
                color: z.string(),
                image: z.string(),
            })

            const { 
                id,
                name,
                description,
                color,
                image
            } = categorySchema.parse(request.body)

            const updateCategoryUseCase = await makeUpdateCategory()
            
            const category = await updateCategoryUseCase.execute({
                id,
                name,
                description,
                color,
                image
            })
            return reply.status(200).send(category)
            
          } catch (error) {
            throw error
          }
}
    
