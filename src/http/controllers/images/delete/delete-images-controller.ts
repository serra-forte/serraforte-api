import { makeDeleteImage } from '@/usecases/factories/images/make-delete-images-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteImage (request: FastifyRequest, reply:FastifyReply){
        try {
            const imageSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = imageSchemaParms.parse(request.params)
           
            const deleteImageCampingUseCase = await makeDeleteImage()
            
            await deleteImageCampingUseCase.execute({
               id
            })

            return reply.status(200).send({message: "Image deleted successfully"})
          } catch (error) {
            throw error
          }
}
    
