import { makeUpdateAddress } from '@/usecases/factories/address/make-update-address-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                id: z.string().uuid(),
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
                id,
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
            } = userSchema.parse(request.body);

            const updateAddressUseCase = await makeUpdateAddress()

            const address = await updateAddressUseCase.execute({
                id,
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
    
