import { makeCreateBoxes } from "@/usecases/factories/boxes/make-create-boxes-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function CreateBox(request: FastifyRequest, reply: FastifyReply) {
        try {
            const boxesBodySchema = z.object({
                name: z.string(),
                description: z.string().optional().nullable(),
                amount: z.number().nonnegative(),
                weight: z.number().nonnegative(),
                height: z.number().nonnegative(),
                length: z.number().nonnegative(),
                width: z.number().nonnegative(),
            })
    
            const {
                name,
                description,
                amount,
                weight,
                height,
                length,
                width
            } = boxesBodySchema.parse(request.body)
    
            const createBoxesUseCase = await makeCreateBoxes()
    
            const boxes = await createBoxesUseCase.execute({
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