import { makeUpdateBoxes } from "@/usecases/factories/boxes/make-update-boxes-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateBox(request: FastifyRequest, reply: FastifyReply) {
        try {
            const boxesBodySchema = z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string().optional().nullable(),
                amount: z.number().nonnegative(),
                weight: z.number().nonnegative(),
                height: z.number().nonnegative(),
                length: z.number().nonnegative(),
                width: z.number().nonnegative(),
            })
    
            const {
                id,
                name,
                description,
                amount,
                weight,
                height,
                length,
                width
            } = boxesBodySchema.parse(request.body)
    
            const updateBoxesUseCase = await makeUpdateBoxes()
    
            const boxes = await updateBoxesUseCase.execute({
                id,
                name,
                description,
                amount,
                weight,
                height,
                length,
                width
            })
    
            return reply.status(201).send(boxes)
        } catch (error) {
            throw error
        }
}