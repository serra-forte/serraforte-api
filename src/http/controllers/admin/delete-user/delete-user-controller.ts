import { makeDeleteUserByAdmin } from '@/usecases/factories/admins/make-delete-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteUserByAdmin (request: FastifyRequest, reply:FastifyReply){
        try {
            const userParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = userParams.parse(request.params)


            const deleteUserUseCase = await makeDeleteUserByAdmin()
            
            await deleteUserUseCase.execute({
                id,
            })
            
            
            return reply.status(200).send({message: 'Usuário deletado com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
