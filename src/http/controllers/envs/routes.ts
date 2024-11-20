import { FastifyInstance } from "fastify";
import { RefreshTokenMelhorEnvio } from "./melhor-envio/refresh-token-melhor-envio-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function envRoutes(fastifyApp: FastifyInstance) {
    // atualizar tokens melhor envio
    fastifyApp.put('/melhor-envio/refresh-token', {
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')]
    }, RefreshTokenMelhorEnvio)
}