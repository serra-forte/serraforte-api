import { makeListByShopkeeper } from '@/usecases/factories/users/make-list-by-shopkeeper-users-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListByShopkeeper(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const querySchema = z.object({
      page: z.coerce.number().optional(),
      take: z.coerce.number().optional(),
    })

    const { page, take } = querySchema.parse(request.query)

    const listUserUseCase = await makeListByShopkeeper()

    const users = await listUserUseCase.execute({
      page,
      take
    })

    return reply.status(200).send(users)
  } catch (error) {
    throw error
  }
}
