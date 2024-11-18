import { makeSendVerificationEmail } from '@/usecases/factories/users/make-send-verification-email-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function SendVerificationEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userSchema = z.object({
      email: z.string().email(),
    })

    const { email } = userSchema.parse(request.params)

    const sendEmailVerificationUserUsecase = await makeSendVerificationEmail()

    await sendEmailVerificationUserUsecase.execute({
      email,
    })

    return reply
      .status(200)
      .send({ message: 'E-mail de verificação enviado com sucesso!' })
  } catch (error) {
    throw error
  }
}
