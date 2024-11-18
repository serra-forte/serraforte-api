import { FastifyInstance } from "fastify";
import { DeleteCartItem } from "./delete/delete-cart-item-controller";
import { UpdateCartItem } from "./update/update-cart-item-controller";
import { CreateCartItem } from "./create/create-cart-item-controller";
import { DeleteAllCartItem } from "./delete-all/delete-all-cart-item-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";

export async function cartItemsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // create cart item
    fastifyApp.post('/', CreateCartItem)

    // delete cart item
    fastifyApp.delete('/:id', DeleteCartItem)

    // deletar todos os cart items
    fastifyApp.delete('/delete-all', DeleteAllCartItem)

    // update cart item
    fastifyApp.patch('/', UpdateCartItem)
}