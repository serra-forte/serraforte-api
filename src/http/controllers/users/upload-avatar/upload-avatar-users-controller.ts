import { makeUploadAvatar } from "@/usecases/factories/users/make-upload-avatar-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UploadAvatar (request: FastifyRequest, reply:FastifyReply){
    try {
        const uploadAvatarBodySchema = z.object({
            avatarUrl: z.string(),
        })

        const {
            avatarUrl
        } = uploadAvatarBodySchema.parse(request.body)

        const uploadAvatarUseCase = await makeUploadAvatar()

        const updatedTokens = await uploadAvatarUseCase.execute({
            userId: request.user.id,
            avatarUrl
        })

        return reply.status(200).send(updatedTokens)
    } catch (error) {
       throw error
    }
}