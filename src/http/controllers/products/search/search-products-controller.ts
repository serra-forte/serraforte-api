import { makeSearchProduct } from '@/usecases/factories/products/make-search-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function SearchProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
                keyword: z.string(),
            })

            const { 
                keyword

             } = querySchema.parse(request.params)

            const createProductUseCase = await makeSearchProduct()
            
            const products = await createProductUseCase.execute({
              keyword
            })
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
