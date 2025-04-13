import { makeListAddressByUser } from '@/usecases/factories/address/make-list-address-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListAddressByUser(request: FastifyRequest, reply:FastifyReply){
        try {
            const querySchema = z.object({
                userId: z.string().uuid(),
            })

            const { userId } = querySchema.parse(request.query)

            const createAddressUseCase = await makeListAddressByUser()
            
            const Addresss = await createAddressUseCase.execute({
                userId
            })
            return reply.status(200).send(Addresss)
            
          } catch (error) {
            throw error
          }
}
    
