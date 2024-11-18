import { makeDeleteBoxes } from "@/usecases/factories/boxes/make-delete-boxes-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function DeleteBox(request: FastifyRequest, reply: FastifyReply) {
    try {
        const boxParamsSchema = z.object({
            id: z.string().uuid(),
        })
    
        const {
            id,
        } = boxParamsSchema.parse(request.params)
    
        const deleteBoxUseCase = await makeDeleteBoxes()
    
        const box = await deleteBoxUseCase.execute({
            id,
        })
    
        return reply.status(201).send(box)
    } catch (error) {
        throw error
    }
}