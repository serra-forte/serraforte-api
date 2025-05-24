import { makeCreateStore } from '@/usecases/factories/stores/create-store-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { z } from 'zod'

export async function CreateStore(request: FastifyRequest, reply:FastifyReply){
        try {
            const storeSchema = z.object({
                address: z.object({
                    postalCode: z.string(),    
                    street: z.string(),       
                    number: z.string(),         
                    complement: z.string(),    
                    city: z.string(),       
                    state: z.string(),
                }),
                companyName: z.string(),
                description: z.string(),
                document: z.string().refine((val) => {
                        return cpf.isValid(val) || cnpj.isValid(val);
                    }, 
                    {
                        message: "CPF ou CNPJ inválido",
                    }
                ),
                email: z.string().email({message: "E-mail inválido"}),
                hasERPIntegration: z.boolean(),
                name: z.string(),
                stateRegister: z.string(),
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
                userId: request.user.id
            })

            return reply.status(200).send(store)
            
          } catch (error) {
            throw error
          }
}
    
