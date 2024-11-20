import { makeRefreshTokenMelhorEnvio } from "@/usecases/factories/envs/melhor-envio/refresh-token-melhor-envio";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RefreshTokenMelhorEnvio(request: FastifyRequest, reply:FastifyReply) {
    try {
        const tokenQuerySchema = z.object({
            refreshToken: z.string(),
            token: z.string(),
        })

        const {
            refreshToken,
            token
        } = tokenQuerySchema.parse(request.query)


        const refreshTokenMelhorEnvioUseCase = await makeRefreshTokenMelhorEnvio()

        const refreshTokenMelhorEnvio = await refreshTokenMelhorEnvioUseCase.execute({
            refreshToken,
            token
        })
        return reply.status(200).send(refreshTokenMelhorEnvio)
    } catch (error) {
        throw error
    }
}