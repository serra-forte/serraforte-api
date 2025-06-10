import { makeCreateDeliveryOrder } from '@/usecases/factories/orders/make-create-delivery-order-usecase';
import { makeCreateWithdrawOrderUseCase } from '@/usecases/factories/orders/make-create-withdraw-order-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from "zod";

export async function CreateWithdrawOrder(request: FastifyRequest, reply: FastifyReply){
    try {
        const orderSchemaBody = z.object({
             user: z.object({
                name: z.string(),
                email: z.string(),
                phone: z.string(),
                cpf: z.string(),
            }),
            billingType: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']),
            coupom: z.object({
                code: z.string(),
            }).optional().nullable(),
            creditCardData: z.object({
                creditCard: z.object({
                     holderName: z.string(),
                    number: z.string(),
                    expiryMonth: z.string(),
                    expiryYear: z.string(),
                    ccv: z.string(),
                }),
                creditCardHolderInfo: z.object({
                postalCode: z.string(),
                addressNumber: z.string(),
                addressComplement: z.string(),
                }),
                installmentCount: z.number().int().positive().optional(),
            }).optional(),
        })
    
        const { 
            user,
            creditCardData,
            billingType, 
            coupom
        } = orderSchemaBody.parse(request.body)
    
        const createDeliveryOrderUseCase = await makeCreateWithdrawOrderUseCase()

        const order = await createDeliveryOrderUseCase.execute({
            userData: {
                id: request.user.id,
                ...user
            },
            remoteIp: String(request.socket.remoteAddress),
            paymentMethod: billingType,
            coupom,
            creditCardData,
        })

        return reply.status(201).send(order)
    }catch(error){
        throw error
    }
}