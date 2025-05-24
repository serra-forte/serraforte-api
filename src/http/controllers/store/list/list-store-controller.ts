import { makeListStore } from '@/usecases/factories/stores/list-store-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListStore(request: FastifyRequest, reply:FastifyReply){
        try {
            const createStoreUseCase = await makeListStore()
            
            const stores = await createStoreUseCase.execute()
            return reply.status(200).send(stores)
            
          } catch (error) {
            throw error
          }
}
    
