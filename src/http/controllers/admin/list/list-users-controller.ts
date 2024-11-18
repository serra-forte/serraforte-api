import { makeListUsers } from '@/usecases/factories/admins/make-list-users-different-pacient-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const listUserUseCase = await makeListUsers()

    const users = await listUserUseCase.execute()

    return reply.status(200).send(users)
  } catch (error) {
    throw error
  }
}
