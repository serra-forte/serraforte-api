import { makeCreateStore } from '@/usecases/factories/stores/create-store-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateStore(request: FastifyRequest, reply:FastifyReply){
        try {
            const storeSchema = z.object({
                address: z.object({
                    postalPode: z.string(),    
                    street: z.string(),       
                    number: z.string(),         
                    complement: z.string(),    
                    city: z.string(),       
                    state: z.string(),
                }),
                companyName: z.string(),
                description: z.string(),
                document: z.string(),
                email: z.string(),
                hasERPIntegration: z.boolean(),
                name: z.string(),
                stateRegister: z.string(),
                userId: z.string().uuid(),
            })

            const { 
                address,
                companyName,
                description,
                document,
                email,
                hasERPIntegration,
                name,
                stateRegister,
                userId
            } = storeSchema.parse(request.body)

            const createProductUseCase = await makeCreateStore()
            
            const store = await createProductUseCase.execute({
                address,
                companyName,
                description,
                document,
                email,
                hasERPIntegration,
                name,
                stateRegister,
                userId
            })

            return reply.status(200).send(store)
            
          } catch (error) {
            throw error
          }
}
    
