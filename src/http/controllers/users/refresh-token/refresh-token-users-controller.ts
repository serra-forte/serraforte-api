import { makeRefreshToken } from "@/usecases/factories/users/make-refresh-token-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RefreshToken (request: FastifyRequest, reply:FastifyReply){
    try {
        const refreshTokenBodySchema = z.object({
            refreshToken: z.string(),
        })

        const {
            refreshToken
        } = refreshTokenBodySchema.parse(request.body)

        const refreshTokenUseCase = await makeRefreshToken()

        const updatedTokens = await refreshTokenUseCase.execute({token: refreshToken})

        return reply.status(200).send(updatedTokens)
    } catch (error) {
       throw error
    }
}