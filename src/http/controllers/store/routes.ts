import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { CreateStore } from "./create/create-store-controller";
import { ListStore } from "./list/list-store-controller";

export async function storeRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.addHook('onRequest', verifyTokenJWT)
   fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

   fastifyApp.post('/', CreateStore)
   fastifyApp.get('/', ListStore)
}