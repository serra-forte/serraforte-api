import { DecrementCartItemUseCase } from '@/usecases/cart-items/decrement/decrement-cart-item-usecase';
import { IncrementCartItemUseCase } from '@/usecases/cart-items/increment/increment-cart-item-usecase';
import { makeDecrementCartItem } from '@/usecases/factories/cart-items/make-decrement-cart-items-usecase';
import { makeIncrementCartItem } from "@/usecases/factories/cart-items/make-increment-cart-items-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateCartItem(request: FastifyRequest, reply:FastifyReply){
    try {
        const cartItemSchema = z.object({
            id: z.string().uuid(),
            action: z.enum(['increment', 'decrement'])
        })

        const { 
            id,
            action
            } = cartItemSchema.parse(request.query)

        let createCartItemUseCase = {} as IncrementCartItemUseCase | DecrementCartItemUseCase

        createCartItemUseCase = action === 'decrement' ? await makeDecrementCartItem() : await makeIncrementCartItem();
        
        const cartItem = await createCartItemUseCase.execute({
            id,
            shoppingCartId: request.user.shoppingCartId
        })
        return reply.status(200).send(cartItem)
        
      } catch (error) {
        throw error
    }
}