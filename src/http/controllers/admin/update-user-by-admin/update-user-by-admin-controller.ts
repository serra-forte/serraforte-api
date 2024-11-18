import { makeUpdateUserByAdmin } from '@/usecases/factories/admins/make-update-user-by-admin-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateUserByAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userSchema = z.object({
      id: z.string().uuid(),
      name: z.string().min(4).optional().nullable(),
      email: z.string().email().optional().nullable(),
      password: z.string().min(6).nullable().optional(),
      phone: z.string().optional().nullable(),
      paymentFee: z.number().optional().nullable(),
      paymentType: z.enum(['FIXO', 'PERCENTAGE']).optional().nullable(),
    })

    const { id, email, name, password, phone, paymentFee, paymentType } =
      userSchema.parse(request.body)

    const updateUseCase = await makeUpdateUserByAdmin()

    const updateUser = await updateUseCase.execute({
      userId: id,
      paymentFee,
      paymentType,
      email,
      phone,
      name,
      password,
    })

    return reply.status(201).send(updateUser)
  } catch (error) {
    throw error
  }
}
