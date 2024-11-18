import { makeListByCategory } from '@/usecases/factories/products/make-list-by-category-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListByCategoryProduct(request: FastifyRequest, reply:FastifyReply){
        try {

          const categoryQuerySchema = z.object({
            id: z.string().uuid(),
            page: z.coerce.number().optional().default(1),
          })

            const { id, page } = categoryQuerySchema.parse(request.query)

            const createProductUseCase = await makeListByCategory()
            
            const products = await createProductUseCase.execute({
                id,
                page
            })
            
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
