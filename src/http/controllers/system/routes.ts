import { FastifyInstance } from "fastify";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { IsSystemUpdating } from "./is-system-updating-controller";

export async function systemRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.addHook('onRequest', verifyTokenJWT)
   fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

   fastifyApp.get('/status', IsSystemUpdating)
}