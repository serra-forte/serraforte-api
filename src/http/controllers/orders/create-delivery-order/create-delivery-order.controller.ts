import { makeCreateDeliveryOrder } from '@/usecases/factories/orders/make-create-delivery-order-usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from "zod";

export async function CreateDeliveryOrder(request: FastifyRequest, reply: FastifyReply){
    try {
        const orderSchemaBody = z.object({
            user: z.object({
                name: z.string(),
                email: z.string(),
                phone: z.string(),
                cpf: z.string(),
            }),
            billingType: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']),
            freight: z.object({
                id: z.number(),
                price: z.number().nonnegative(),
                name: z.string(),
                delivery_time: z.number().nonnegative(),
                company: z.object({
                    id: z.number(),
                    name: z.string(),
                })
            }),
            address: z.object({
                id: z.string(),
                street: z.string(),
                num: z.number(),
                neighborhood: z.string(),
                city: z.string(),
                state: z.string(),
                country: z.string(),
                zipCode: z.string(),
                complement: z.string().optional(),
                reference: z.string().optional(),
            }),
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
            user,
            creditCard,
            creditCardHolderInfo,
            billingType, 
            installmentCount,
            address,
            freight,
            coupom
        } = orderSchemaBody.parse(request.body)
    
        const createDeliveryOrderUseCase = await makeCreateDeliveryOrder()

        const order = await createDeliveryOrderUseCase.execute({
            userData: {
                id: request.user.id,
               ...user
            },
            remoteIp: String(request.socket.remoteAddress),
            freight,
            address,
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