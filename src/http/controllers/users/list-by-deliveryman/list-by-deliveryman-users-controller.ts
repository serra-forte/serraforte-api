import { makeListByDeliveryMan } from '@/usecases/factories/users/make-list-by-deliveryman-users-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListByDeliveryMan(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const querySchema = z.object({
      page: z.coerce.number().optional(),
      take: z.coerce.number().optional(),
    })

    const { page, take } = querySchema.parse(request.query)

    const listUserUseCase = await makeListByDeliveryMan()

    const users = await listUserUseCase.execute({
      page,
      take
    })

    return reply.status(200).send(users)
  } catch (error) {
    throw error
  }
}
