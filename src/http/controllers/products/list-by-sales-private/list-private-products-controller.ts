import { makeListProductBySalesPrivate } from '@/usecases/factories/products/make-list-by-sales-private-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListBySalesPrivate(request: FastifyRequest, reply:FastifyReply){
        try {
          const querySchema = z.object({
            page: z.coerce.number().optional().default(1),
          })

          const { page } = querySchema.parse(request.query)

            const listProductUseCase = await makeListProductBySalesPrivate()


            const products = await listProductUseCase.execute({
              shopkeeperId: request.user.id,
              page
            })
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
