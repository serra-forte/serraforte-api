import { makeLoginUser } from '@/usecases/factories/users/make-login-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function LoginUser (request: FastifyRequest, reply:FastifyReply){
    try {
        const userSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })

        const {
            email,
            password,
        } = userSchema.parse(request.body)
        
        const loginUserUseCase = await makeLoginUser()

        const userInfo = await loginUserUseCase.execute({
          email,
          password,
        })

        // Serializa os tokens para uma string JSON
        // const serializedTokens = JSON.stringify({
        //   accessToken: userInfo.accessToken,
        //   refreshToken: userInfo.refreshToken
        // });

        return reply.status(200).setCookie('access_token', userInfo.accessToken, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 24 * 2, // 2 days
        }).send(userInfo)

      } catch (error) {
        
        throw error
      }
}

