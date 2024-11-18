import { makeListProduct } from '@/usecases/factories/products/make-list-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
                page: z.coerce.number().optional().default(1),
            })

            const { page } = querySchema.parse(request.query)

            const createProductUseCase = await makeListProduct()
            
            const products = await createProductUseCase.execute({
                page
            })
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
