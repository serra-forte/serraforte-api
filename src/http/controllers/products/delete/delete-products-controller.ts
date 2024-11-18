import { makeDeleteProduct } from '@/usecases/factories/products/make-delete-products-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteProduct(request: FastifyRequest, reply:FastifyReply){
        try {
            const productSchema = z.object({
                id: z.string().uuid(),
            })

            const { 
                id
            } = productSchema.parse(request.params)

            const deleteProductUseCase = await makeDeleteProduct()
            
            await deleteProductUseCase.execute({
                id,
            })
            return reply.status(200).send({message: "Product deleted successfully"})
            
          } catch (error) {
            throw error
          }
}
    
