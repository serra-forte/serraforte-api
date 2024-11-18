import { makeFilterProduct } from '@/usecases/factories/products/make-filter-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FilterProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
                name: z.string().optional(),
                price: z.union([z.boolean(), z.string().transform(val => (val === '' ? undefined : val))])
                .nullable()
                .optional(),
                code: z.coerce.number().optional(),
                category: z.string().optional(),
                sales: z.union([z.boolean(), z.string().transform(val => (val === '' ? undefined : val))])
                .nullable()
                .optional(),
                page: z.coerce.number().optional().default(1),
            })

            const { 
                name,
                price,
                code,
                category,
                sales,
                page
             } = querySchema.parse(request.query)

            const createProductUseCase = await makeFilterProduct()
            
            const products = await createProductUseCase.execute({
                name,
                price,
                code,
                category,
                sales,
                page
            })
            return reply.status(200).send(products)
            
          } catch (error) {
            throw error
          }
}
    
