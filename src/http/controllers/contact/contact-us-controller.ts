import { makeContactUs } from '@/usecases/factories/contact/make-contact-us-usecase'
import { makeGetItem } from '@/usecases/factories/erp/make-get-item-usercase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ContactUs(request: FastifyRequest, reply:FastifyReply){
    try {
        const contactBody = z.object({
                name: z.string().min(4),
                email: z.string().email(),
                message: z.string().min(10),
                phone: z.string(),
                subject: z.enum(['DUVIDA', 'SUGESTAO', 'RECLAMACAO', 'OUTRO']),
            })

        const { 
            name,
            email,
            message,
            phone,
            subject
        } = contactBody.parse(request.body)
        
        const contactUsUseCase = await makeContactUs()
        
        await contactUsUseCase.execute({
            name,
            email,
            message,
            phone,
            subject
        })
        
        return reply.status(204).send()
        
    } catch (error) {
        throw error
    }
}
    
