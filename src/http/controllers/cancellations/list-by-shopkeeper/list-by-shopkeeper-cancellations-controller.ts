import { makeListCancellationByShopkeeper } from '@/usecases/factories/cancellations/make-list-by-shopkeeper-cancellations-usecase';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListCancellationsByShopkeeper(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
              page: z.coerce.number().optional().default(1),
            })

            const { page } = querySchema.parse(request.query)

            const listCancellationsUseCase = await makeListCancellationByShopkeeper()
            
            const cancellations = await listCancellationsUseCase.execute({
                shopkeeperId: request.user.id,
                page
            })
            
            return reply.status(200).send(cancellations)
            
          } catch (error) {
            throw error
          }
}
    
