import { makeCreateProduct } from '@/usecases/factories/products/make-create-products-usecase'
import { makeUpdateProduct } from '@/usecases/factories/products/make-update-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const productSchema = z.object({
                id: z.string().uuid(),
                categoryId: z.string().optional().nullable(),
                shopKeeperId: z.string().optional().nullable(),
                name: z.string().min(4),
                description: z.string().optional().nullable(),
                quantity: z.number().nonnegative(),
                mainImage: z.string().optional().nullable(),
                price: z.number().nonnegative(),
                active: z.boolean(),
            })

            const { 
                id,
                name,
                description,
                price,
                quantity,
                mainImage,
                categoryId,
                shopKeeperId,
                active
            } = productSchema.parse(request.body)

            const updateProductUseCase = await makeUpdateProduct()
            
            const product = await updateProductUseCase.execute({
                id,
                name,
                description,
                price,
                quantity,
                mainImage,
                categoryId,
                shopKeeperId,
                active
            })
            return reply.status(200).send(product)
            
          } catch (error) {
            throw error
          }
}
    
