import { makeCreateCategory } from '@/usecases/factories/categories/make-create-categories-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateCategory(request: FastifyRequest, reply:FastifyReply){
        try {
            const categorySchema = z.object({
                name: z.string().min(4),
                description: z.string().optional(),
                color: z.string(),
                image: z.string(),
            })

            const { 
                name,
                description,
                color,
                image
            } = categorySchema.parse(request.body)

            const createCategoryUseCase = await makeCreateCategory()
            
            const category = await createCategoryUseCase.execute({
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
    
