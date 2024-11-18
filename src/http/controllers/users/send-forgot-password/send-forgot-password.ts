import { makeSendForgotPassword } from '@/usecases/factories/users/make-send-forgot-password-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function SendForgotPassword (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              email: z.string().email(),
            })

            const {
              email,
            } = userSchema.parse(request.body)

            const sendForgotPasswordUsecase = await makeSendForgotPassword()

            await sendForgotPasswordUsecase.execute({
              email
            })

            return reply.status(200).send({ message: 'E-mail de redefinição de senha enviado com sucesso!' })

          } catch (error) {
            throw error
          }
}

