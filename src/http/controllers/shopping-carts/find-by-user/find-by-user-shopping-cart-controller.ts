import { makeFindByUserShoppingCart } from "@/usecases/factories/shopping-carts/make-find-by-user-shopping-cart-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export async function FindByUserShoppingCart(request: FastifyRequest, reply:FastifyReply){
    try {
        const createShoppingCartUseCase = await makeFindByUserShoppingCart()
        
        const shoppingCart = await createShoppingCartUseCase.execute({
           id: request.user.id,
        })
        return reply.status(200).send(shoppingCart)
        
      } catch (error) {
        throw error
    }
}