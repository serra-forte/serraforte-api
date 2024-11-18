import { makeListCancellationByUser } from '@/usecases/factories/cancellations/make-list-by-user-cancellations-usecase';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListCancellationsByUser(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
              page: z.coerce.number().optional().default(1),
            })

            const { page } = querySchema.parse(request.query)

            const listCancellationsUseCase = await makeListCancellationByUser()
            
            const cancellations = await listCancellationsUseCase.execute({
                userId: request.user.id,
                page
            })
            
            return reply.status(200).send(cancellations)
            
          } catch (error) {
            throw error
          }
}
    
