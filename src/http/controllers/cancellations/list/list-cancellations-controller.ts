import { makeListCancellation } from '@/usecases/factories/cancellations/make-list-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListCancellations(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
              page: z.coerce.number().optional().default(1),
            })

            const { page } = querySchema.parse(request.query)

            const listCancellationsUseCase = await makeListCancellation()
            
            const cancellations = await listCancellationsUseCase.execute({
                page
            })
            return reply.status(200).send(cancellations)
            
          } catch (error) {
            throw error
          }
}

    
