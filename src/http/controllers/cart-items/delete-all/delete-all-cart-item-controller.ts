import { makeDeleteAllCartItem } from "@/usecases/factories/cart-items/make-delete-all-cart-items-usecase copy";
import { FastifyReply, FastifyRequest } from "fastify";

export async function DeleteAllCartItem(request: FastifyRequest, reply:FastifyReply){
    try {
        const deleteCartItemUseCase = await makeDeleteAllCartItem()

        
        await deleteCartItemUseCase.execute({
            shoppingCartId: request.user.shoppingCartId,
        })
        return reply.status(200).send({message: "Itens deletado com sucesso"})
        
      } catch (error) {
        throw error
    }
}