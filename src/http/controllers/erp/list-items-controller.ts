import { makeGetItem } from '@/usecases/factories/erp/make-list-items-usercase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function GetItem(request: FastifyRequest, reply:FastifyReply){
    try {
        const itemsParams = z.object({
                id: z.coerce.number().nonnegative(),
            })

        const { 
            id
        } = itemsParams.parse(request.params)
        
        const getItemUseCase = await makeGetItem()
        
        const getItem = await getItemUseCase.execute({
            id
        })
        
        return reply.status(200).send(getItem)
        
    } catch (error) {
        throw error
    }
}
    
