import { makeIsSystemUpdating } from '@/usecases/factories/system/make-is-system-updating-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function IsSystemUpdating(request: FastifyRequest, reply:FastifyReply){
        try {
            const isSystemUpdatingUseCase = await makeIsSystemUpdating()
            
            const systemStatus = await isSystemUpdatingUseCase.execute()
            return reply.status(200).send(systemStatus)
            
          } catch (error) {
            throw error
          }
}

    
