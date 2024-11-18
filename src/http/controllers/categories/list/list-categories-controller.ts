import { makeListCategory } from '@/usecases/factories/categories/make-list-categories-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListCategory(request: FastifyRequest, reply:FastifyReply){
        try {
            const listCategoryUseCase = await makeListCategory()
            
            const categories = await listCategoryUseCase.execute()
            
            return reply.status(200).send(categories)
            
          } catch (error) {
            throw error
          }
}
    
