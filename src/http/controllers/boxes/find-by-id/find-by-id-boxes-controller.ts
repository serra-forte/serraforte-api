import { makeFindByIdBox } from "@/usecases/factories/boxes/make-find-by-id-boxes-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function FindByIdBox(request: FastifyRequest, reply: FastifyReply) {
       try {
        const boxParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const {
            id,
        } = boxParamsSchema.parse(request.params)

        const findbyidBoxUseCase = await makeFindByIdBox()

        const box = await findbyidBoxUseCase.execute({
            id,
        })

        return reply.status(201).send(box)
       } catch (error) {
        throw error 
       }
}