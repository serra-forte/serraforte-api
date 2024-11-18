import { env } from '@/env'
import { AppError } from '@/usecases/errors/app-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAsaasPaymentToken(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    // [x] destruturar do headers o token da asaas
    const authHeader = request.headers['asaas-access-token']

    if (!authHeader) {
      throw new AppError('Token not found')
    }

    if (!authHeader.includes(env.ASAAS_PAYMENT_TOKEN)) {
      throw new AppError('Token not valid')
    }

    // [x] se não existir o token, retorna erro
  } catch (error) {
    throw new AppError('Token of payment not valid')
  }
}
