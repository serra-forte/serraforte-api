import { makeSendMessageToCancellation } from '@/usecases/factories/cancellations/make-send-message-cancellations-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function SendMessageCancellation(request: FastifyRequest, reply:FastifyReply){
    try {
        const cancellationSchema = z.object({
            cancellationId: z.string().uuid(),
            message: z.string(),
            imageUrl: z.string().optional().nullable(),
        })

        const { 
            cancellationId,
            message,
            imageUrl
        } = cancellationSchema.parse(request.body)

        const sendmessageCancellationUseCase = await makeSendMessageToCancellation()
        
        await sendmessageCancellationUseCase.execute({
            cancellationId,
            userId: request.user.id,
            message,
            imageUrl
        })
        return reply.status(200).send({ message: 'Mensagem enviada com sucesso!'})
        
        } catch (error) {
        throw error
    }
}
    
