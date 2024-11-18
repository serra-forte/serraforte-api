import { makeCreateCartItem } from "@/usecases/factories/cart-items/make-create-cart-items-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function CreateCartItem(request: FastifyRequest, reply:FastifyReply){
    try {
        const shoppingCartSchema = z.object({
            cartItem: z.array(z.object({
                productId: z.string().uuid(),
                quantity: z.number().nonnegative(),
            }))
        })

        const {cartItem} = shoppingCartSchema.parse(request.body)
            
        const createCartItemUseCase = await makeCreateCartItem()

        const cartItemCreated = await createCartItemUseCase.execute({
            cartItem,
            shoppingCartId: request.user.shoppingCartId
        })
        
        return reply.status(200).send(cartItemCreated)
        
      } catch (error) {
        throw error
    }
}