import { makeFindProduct } from '@/usecases/factories/products/make-find-by-id-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindProduct(request: FastifyRequest, reply:FastifyReply){
    try {
        const productSchema = z.object({
            id: z.string().uuid(),
            page: z.coerce.number().optional().default(1),
        })

        const { 
            id,
            page
        } = productSchema.parse(request.query)

        const findProductUseCase = await makeFindProduct()
        
        const product = await findProductUseCase.execute({
            id,
            page
        })
        return reply.status(200).send(product)
        
        } catch (error) {
        throw error
    }
}
    
