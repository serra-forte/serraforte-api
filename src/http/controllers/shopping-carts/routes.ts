import { FastifyInstance } from "fastify";
import { FindByUserShoppingCart } from "./find-by-user/find-by-user-shopping-cart-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";

export async function shoppingCartRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // buscar carrio pelo usuario
    fastifyApp.get('/user', FindByUserShoppingCart)
}