import { makeListBoxes } from "@/usecases/factories/boxes/make-list-boxes-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export async function ListBoxes(request: FastifyRequest, reply: FastifyReply) {
       try {
        const findbyidBoxesUseCase = await makeListBoxes()

        const boxes = await findbyidBoxesUseCase.execute()

        return reply.status(201).send(boxes)
       } catch (error) {
        throw error
       }
}