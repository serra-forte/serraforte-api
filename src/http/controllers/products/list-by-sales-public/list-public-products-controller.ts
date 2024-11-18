import { makeListProductBySalesPublic } from '@/usecases/factories/products/make-list-by-sales-public-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListBySalesPublic(request: FastifyRequest, reply:FastifyReply){
        try {
          const querySchema = z.object({
            page: z.coerce.number().optional().default(1),
          })

          const { page } = querySchema.parse(request.query)

            const listProductUseCase = await makeListProductBySalesPublic()


            const products = await listProductUseCase.execute({
              page
            })
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
