import { makeListCancellationByStatus } from '@/usecases/factories/cancellations/make-list-by-status-cancellations'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListCancellationByStatus(request: FastifyRequest, reply:FastifyReply){
    try {
        const querySchema = z.object({
            status: z.enum(['APPROVED', 'REPROVED', 'PENDING']),
            page: z.coerce.number().optional().default(1),
        })

        const { 
            status,
            page
        } = querySchema.parse(request.query)

        const ListCancellationByStatusUseCase = await makeListCancellationByStatus()
        
       const cancellations = await ListCancellationByStatusUseCase.execute({
            status,
            userId: request.user.id,
            role: request.user.role,
            page
        })
        return reply.status(200).send(cancellations)
        
        } catch (error) {
        throw error
    }
}
    
