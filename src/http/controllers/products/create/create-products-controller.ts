import { makeCreateProduct } from '@/usecases/factories/products/make-create-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const productSchema = z.object({
                categoryId: z.string().uuid(),
                shopKeeperId: z.string().uuid(),
                name: z.string().min(4),
                description: z.string().optional().nullable(),
                quantity: z.number().nonnegative(),
                weight: z.number().nonnegative(),
                mainImage: z.string().optional().nullable(),
                price: z.number().nonnegative(),
                active: z.boolean(),
                height: z.number().nonnegative(),
                width: z.number().nonnegative(),
                length: z.number().nonnegative(),
                boxesIds: z.array(z.string().uuid())
            })

            const { 
                name,
                description,
                price,
                quantity,
                mainImage,
                categoryId,
                shopKeeperId,
                weight,
                active,
                height,
                width,
                length,
                boxesIds
            } = productSchema.parse(request.body)

            const createProductUseCase = await makeCreateProduct()
            
            const product = await createProductUseCase.execute({
                name,
                description,
                price,
                quantity,
                mainImage,
                weight,
                categoryId,
                shopKeeperId,
                active,
                height,
                width,
                length,
                boxesIds
            })
            return reply.status(200).send(product)
            
          } catch (error) {
            throw error
          }
}
    
