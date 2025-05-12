import { FastifyInstance } from "fastify";
import { ListItems } from "./list-items-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function erpRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.addHook('onRequest', verifyTokenJWT)
   fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

   fastifyApp.get('/items', ListItems)
}