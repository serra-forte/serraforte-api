import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { GetItem } from "./list-items-controller";

export async function erpRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.addHook('onRequest', verifyTokenJWT)
   fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

   fastifyApp.get('/item/:id', GetItem)
}