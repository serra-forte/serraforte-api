import { makeCreateAddress } from '@/usecases/factories/address/make-create-address-usecase';
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                user: z.object({
                    id: z.string().uuid().optional(),
                }).optional(),
                announcement: z.object({
                    id: z.string().uuid().optional(),
                }).optional(),
                street: z.string(),
                num: z.number().nonnegative(),
                neighborhood: z.string(),
                country: z.string(),
                city: z.string(),
                state: z.string(),
                zipCode: z.number().nonnegative(),
                complement: z.string().optional(),
                reference: z.string().optional(),
            })

            const { 
                announcement,
                user,
                street,
                num,
                neighborhood,
                country,
                city,
                state,
                zipCode,
                complement,
                reference,
            } = userSchema.parse(request.body)

            const createAddressUseCase = await makeCreateAddress()

            const address = await createAddressUseCase.execute({
                userId: user?.id,
                idAnnouncement: announcement?.id,
                street,
                num,
                neighborhood,
                country,
                city,
                state,
                zipCode,
                complement,
                reference,
            })
            
           
            return reply.status(200).send(address)
            
          } catch (error) {
            
            throw error
          }
}
    
