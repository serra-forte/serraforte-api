import { makeDeleteCategory } from '@/usecases/factories/categories/make-delete-categories-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteCategory(request: FastifyRequest, reply:FastifyReply){
        try {
            const categorySchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = categorySchema.parse(request.params)

            const deleteCategoryUseCase = await makeDeleteCategory()
            
            await deleteCategoryUseCase.execute({
                id,
            })
            return reply.status(200).send({message: 'Category deleted successfully'})
            
          } catch (error) {
            throw error
          }
}
    
