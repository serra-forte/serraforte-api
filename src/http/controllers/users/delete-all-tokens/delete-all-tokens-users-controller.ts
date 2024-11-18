import { makeDeleteAllToken } from "@/usecases/factories/users/make-delete-all-token-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export async function DeleteAllTokens (request: FastifyRequest, reply:FastifyReply){
    try {
        const refreshTokenUseCase = await makeDeleteAllToken()

        await refreshTokenUseCase.execute()

        return reply.status(200).send({message: 'All tokens deleted'})
    } catch (error) {
       throw error
    }
}