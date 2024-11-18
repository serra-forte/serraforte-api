import { makeVerifyEmail } from '@/usecases/factories/users/make-verify-email-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function VerifyEmail (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              email: z.string().email(),
              token: z.string(),
            })

            const {
              email,
              token,
            } = userSchema.parse(request.query)

            const verifyEmailUseCase = await makeVerifyEmail()

            await verifyEmailUseCase.execute({
              token,
              email
            })

            return reply.status(200).send({ message: 'E-mail verificado com sucesso!' })

          } catch (error) {
            throw error
          }
}

