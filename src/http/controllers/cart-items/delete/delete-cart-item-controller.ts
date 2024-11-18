import { makeDeleteCartItem } from "@/usecases/factories/cart-items/make-delete-cart-items-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function DeleteCartItem(request: FastifyRequest, reply:FastifyReply){
    try {
        const cartItemSchema = z.object({
            id: z.string().uuid(),
        })

        const { 
            id,
            } = cartItemSchema.parse(request.params)

        
        const deleteCartItemUseCase = await makeDeleteCartItem()

        
        await deleteCartItemUseCase.execute({
            id,
            shoppingCartId: request.user.shoppingCartId,
        })
        return reply.status(200).send({message: "Item deletado com sucesso"})
        
      } catch (error) {
        throw error
    }
}