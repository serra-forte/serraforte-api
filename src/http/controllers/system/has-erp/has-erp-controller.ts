import { makeHasErp } from '@/usecases/factories/system/make-has-erp-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function HasErp(request: FastifyRequest, reply:FastifyReply){
        try {
            const hasErpUseCase = await makeHasErp()
            
            const systemStatus = await hasErpUseCase.execute()
            return reply.status(200).send(systemStatus)
            
          } catch (error) {
            throw error
          }
}

    
