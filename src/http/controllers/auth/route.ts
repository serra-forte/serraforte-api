import { FastifyInstance } from "fastify";
import { VerifyTokenIsValid } from "./verify-is-token-valid/verify-is-token-valid-controller";

export async function authRoutes(fastifyApp: FastifyInstance) {
    // rota para validar o token
    fastifyApp.get('/verify-token', VerifyTokenIsValid)
}
