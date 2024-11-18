import { FastifyInstance } from 'fastify'
import { VerifyTokenExists } from './verify-token-exists/verify-token-exists-users-controller'

export async function tokensRoutes(fastifyApp: FastifyInstance) {
 
  // buscar token
  fastifyApp.get('/verify-exists/:token', VerifyTokenExists)
}
