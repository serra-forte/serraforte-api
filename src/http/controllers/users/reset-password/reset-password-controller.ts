import { makeResetPassword } from '@/usecases/factories/users/make-reset-password-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ResetPassword (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              password: z.string().min(6),
            })
            const userSchemaQuery = z.object({
                token: z.string(),
              })

            const {
              password,
            } = userSchemaBody.parse(request.body)

            const {
                token,
              } = userSchemaQuery.parse(request.query)

            const resetPasswordUseCase = await makeResetPassword()

            await resetPasswordUseCase.execute({
              password,
                token
            })

            return reply.status(200).send({ message: 'Password reset successfully' })

          } catch (error) {
           throw error
          }
}

