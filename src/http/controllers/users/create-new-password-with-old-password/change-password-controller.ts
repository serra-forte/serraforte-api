import { makeCreateNewPasswordByOldPassword } from '@/usecases/factories/users/make-change-password-by-old-password-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateNewPasswordByOldPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userSchemaBody = z.object({
      oldPassword: z.string().min(6, 'Mínimo 6 caracteres'),
      newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    })

    const userSchemaParams = z.object({
      id: z.string().uuid('Id inválido'),
    })

    const { id } = userSchemaParams.parse(request.params)

    const {oldPassword, newPassword } = userSchemaBody.parse(
      request.body,
    )

    const createNewPasswordUseCase = await makeCreateNewPasswordByOldPassword()

    await createNewPasswordUseCase.execute({
      userId: id,
      oldPassword,
      newPassword,
    })

    return reply.status(200).send({message: 'Senha alterada com sucesso'})
  } catch (error) {
    throw error
  }
}
