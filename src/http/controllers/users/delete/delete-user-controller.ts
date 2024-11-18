import { makeDeleteUser } from '@/usecases/factories/users/make-delete-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userParams = z.object({
                id: z.string().uuid(),
            })

            const userBodySchema = z.object({
                password: z.string().min(6, 'Mínimo 6 caracteres'),
            })

            const { 
                id,
            } = userParams.parse(request.params)

            const {password} = userBodySchema.parse(request.body)

            const deleteUserUseCase = await makeDeleteUser()
            
            await deleteUserUseCase.execute({
                id,
                password
            })
            
            
            return reply.status(200).send({message: 'Usuário deletado com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
