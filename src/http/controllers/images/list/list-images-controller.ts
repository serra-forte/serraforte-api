import { makeListImage } from '@/usecases/factories/images/make-list-images-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListImage (request: FastifyRequest, reply:FastifyReply){
        try {
          const listImageUseCase = await makeListImage()
            
          const images = await listImageUseCase.execute()

            return reply.status(200).send(images)
          } catch (error) {
            throw error
          }
}
    
