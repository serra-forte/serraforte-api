import { FastifyInstance } from 'fastify'
import { Cancellation } from './create/create-cancellations-controller'
import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
import { ListCancellations } from './list/list-cancellations-controller'
import { ListCancellationsByUser } from './list-by-user/list-by-user-cancellations-controller'
import { FindCancellation } from './find-by-id/find-by-id-cancellations-controller'
import { SendMessageCancellation } from './send-message/send-message-cancellations-controller'
import { ChangeStatusCancellation } from './change-status/change-status-cancellations-controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { ListCancellationsByShopkeeper } from './list-by-shopkeeper/list-by-shopkeeper-cancellations-controller'
import { ListCancellationByStatus } from './list-by-status/list-by-status-cancellations-controller'
import { CountByPending } from './count-by-pending/count-by-pending-reviews-controller'

export async function cancellationsRoutes(fastifyApp: FastifyInstance) {
  fastifyApp.addHook('onRequest', verifyTokenJWT)

  // criar cancelamento
  fastifyApp.post('/',{
    onRequest: [verifyUserRole('GUEST', 'SHOPKEEPER', 'ADMIN', 'SUPER')]
  }, Cancellation)

  // list cancelamentos
  fastifyApp.get('/', {
    onRequest: [verifyUserRole('ADMIN', 'SUPER')]
  }, ListCancellations)

  // listar cancelamentos pelo usuario
  fastifyApp.get('/user',{
    onRequest: [verifyUserRole('GUEST', 'SUPER')]
  }, ListCancellationsByUser)

  // listar cancelamentos pelo lojista
  fastifyApp.get('/shopkeeper', {
    onRequest: [verifyUserRole('SHOPKEEPER', 'SUPER')]
  },ListCancellationsByShopkeeper)

  // encontrar cancelamento pelo id
  fastifyApp.get('/:id',{
    onRequest: [verifyUserRole('GUEST', 'SHOPKEEPER', 'ADMIN', 'SUPER')]
  }, FindCancellation)

  // enviar mesangem para o cancelamento do pedido
  fastifyApp.patch('/message', {
    onRequest: [verifyUserRole('GUEST', 'SHOPKEEPER', 'ADMIN', 'SUPER')]
  }, SendMessageCancellation)

  // alterar o status do cancelamento
  fastifyApp.patch('/change-status',{
    onRequest: [verifyUserRole('SHOPKEEPER', 'ADMIN', 'SUPER')]
  }, ChangeStatusCancellation)

  // listar cancelamentos pelo status e user
  fastifyApp.get('/status', ListCancellationByStatus)

  // contar pelos cancelamentos pendentes
  fastifyApp.get('/count-pending', CountByPending)
}
