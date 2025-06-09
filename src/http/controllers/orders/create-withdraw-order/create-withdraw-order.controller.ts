import { makeCreateDeliveryOrder } from '@/usecases/factories/orders/make-create-delivery-order-usecase';
import { makeCreateWithdrawOrderUseCase } from '@/usecases/factories/orders/make-create-withdraw-order-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from "zod";

export async function CreateWithdrawOrder(request: FastifyRequest, reply: FastifyReply){
    try {
        const orderSchemaBody = z.object({
            billingType: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']),
            coupom: z.object({
                code: z.string(),
            }).optional().nullable(),
            creditCard: z.object({
                holderName: z.string(),
                number: z.string(),
                expiryMonth: z.string(),
                expiryYear: z.string(),
                ccv: z.string(),
            }).optional(),
            creditCardHolderInfo: z.object({
                postalCode: z.string(),
                addressNumber: z.string(),
                addressComplement: z.string(),
            }).optional(),
            installmentCount: z.number().int().positive().optional(),
        })
    
        const { 
            creditCard,
            creditCardHolderInfo,
            billingType, 
            installmentCount,
            coupom
        } = orderSchemaBody.parse(request.body)
    
        const createDeliveryOrderUseCase = await makeCreateWithdrawOrderUseCase()

        const order = await createDeliveryOrderUseCase.execute({
            userId: request.user.id,
            remoteIp: String(request.socket.remoteAddress),
            paymentMethod: billingType,
            coupom,
            creditCardData: { 
                creditCard, 
                creditCardHolderInfo, 
                installmentCount
            },
        })

        return reply.status(201).send(order)
    }catch(error){
        throw error
    }
}