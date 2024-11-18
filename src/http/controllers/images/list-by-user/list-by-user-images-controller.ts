import { makeListImageByUser } from '@/usecases/factories/images/make-list-by-user-images-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListImageByUser (request: FastifyRequest, reply:FastifyReply){
        try {
          const imageSchemaParms = z.object({
            id: z.string().uuid(),
        })

        const { id } = imageSchemaParms.parse(request.params)

        const listImageByUserUseCase = await makeListImageByUser()
        
        const images = await listImageByUserUseCase.execute({
            userId: id
        })

        return reply.status(200).send(images)
        } catch (error) {
            throw error
        }
}
    
