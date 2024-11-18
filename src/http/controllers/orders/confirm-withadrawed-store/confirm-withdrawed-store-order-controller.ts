import { makeConfirmWithdrawed } from '@/usecases/factories/orders/make-confirm-withdrawed-order-uscase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ConfirmWithdrawedStore(request: FastifyRequest, reply:FastifyReply){
        try {
            const orderParams = z.object({
                id: z.string().uuid(),
            })

            const { 
                id,
            } = orderParams.parse(request.params)
            const confirmWithdrawedStoreUseCase = await makeConfirmWithdrawed()
            
            await confirmWithdrawedStoreUseCase.execute({
                orderId: id
            })
            
            return reply.status(200).send({message: 'Confirmação da retirado do pedido realizado com sucesso'})
            
          } catch (error) {
            throw error
          }
}
    
