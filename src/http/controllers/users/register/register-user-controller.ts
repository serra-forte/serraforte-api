import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              name: z.string().min(4), 
              email: z.string().email(), 
              password: z.string().min(6),
              phone: z.string().optional().nullable(), 
              cpf:  z.string().optional().nullable(), 
            })

            const { 
                email, 
                password,
                name,
                phone,
                cpf,
            } = userSchema.parse(request.body)
          
            const registerUseCase = await makeRegisterUser()
            
            const user = await registerUseCase.execute({
                email: email.toLowerCase(), 
                password,
                name,
                phone,
                cpf,
            })
            return reply.status(201).send(user)
            
          } catch (error) {
            throw error
          }
}
    
