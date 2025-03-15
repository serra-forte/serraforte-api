import { makeWebHookGetStatusLabel } from '@/usecases/factories/deliveries/melhor-envio/webhooks/make-authenticate-melhor-envio-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function WebHookGetStatusLabel(request: FastifyRequest, reply:FastifyReply){
    try {
        const tagSchema = z.object({
            tag: z.string(),
            url: z.string().url(),
        });
        
        const orderPostedSchema = z.object({
            event: z.string(),
            data: z.object({
                id: z.string().uuid(),
                protocol: z.string(),
                status: z.string(),
                tracking: z.string().nullable(),
                self_tracking: z.string().nullable(),
                user_id: z.string(),
                // tags: z.array(tagSchema).nullable(),
                created_at: z.string(),
                paid_at: z.string().nullable(),
                generated_at: z.string().nullable(),
                posted_at: z.string(),
                delivered_at: z.string().nullable(),
                canceled_at: z.string().nullable(),
                expired_at: z.string().nullable(),
                tracking_url: z.string().url().nullable(),
            }),
        });

        const {
            event,
            data,
        } = orderPostedSchema.parse(request.body)
       
        const webHookGetStatusLabel = await makeWebHookGetStatusLabel()
        
        await webHookGetStatusLabel.execute({
            event,
            data
        })
        
        return reply.status(200).send()
        
        } catch (error) {
        throw error
    }
}
    
