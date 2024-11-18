import { makeToggleIsReadNotification } from '@/usecases/factories/notifications/make-toggle-is-read-notification-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ToggleIsReadNotification(request: FastifyRequest, reply:FastifyReply){
    try {
        const ToggleIsReadNotificationSchema = z.object({
            cancellationId: z.string().uuid(),
            isRead: z.string()
            .transform((val) => val.toLowerCase() === 'true')
            .pipe(z.boolean())
        })

        const { 
            cancellationId,
            isRead
        } = ToggleIsReadNotificationSchema.parse(request.query)

        const ToggleIsReadNotificationUseCase = await makeToggleIsReadNotification()
        
        await ToggleIsReadNotificationUseCase.execute({
            cancellationId,
            isRead
        })
        return reply.status(200).send({ message: 'Notificação alterada com sucesso'})
        
        } catch (error) {
        throw error
    }
}
    
