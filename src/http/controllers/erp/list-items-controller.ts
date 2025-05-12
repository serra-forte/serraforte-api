import { makeListItems } from '@/usecases/factories/erp/make-list-items-usercase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListItems(request: FastifyRequest, reply:FastifyReply){
    try {
        const itemsParams = z.object({
                clientId: z.number().nonnegative(),
                page: z.coerce.number().optional().default(1),
                perPage: z.coerce.number().optional().default(10),
                filterSearch: z.string().optional(),
            })

        const { 
            clientId,
            page,
            perPage,
            filterSearch
        } = itemsParams.parse(request.query)
        
        const listItemUseCase = await makeListItems()
        
        const listItems = await listItemUseCase.execute({
            client_id: clientId,
            page,
            per_page: perPage,
            search: filterSearch
        })
        
        return reply.status(200).send(listItems)
        
    } catch (error) {
        throw error
    }
}
    
