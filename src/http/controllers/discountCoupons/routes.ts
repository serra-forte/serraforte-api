import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { CreateDiscountCounpon } from './create/create-discount-coupons-controller'
import { ListDiscountCounpon } from './list/list-discount-coupons-controller'
import { FindDiscountCounponByCode } from './find-by-code/find-by-code-discount-coupons-controller'
import { FindDiscountCounponById } from './find-by-id/find-by-id-discount-coupons-controller'
import { DeleteDiscountCounpon } from './delete/delete-discount-coupons-controller'
import { UpdateDiscountCounpon } from './update/update-discount-coupons-controller'
import { ListByShopkeeper } from './list-by-shopkeeper/list-by-shopkeeper-discount-coupons-controller'

export async function discountCouponRoutes(fastifyApp: FastifyInstance) {
  fastifyApp.addHook('onRequest', verifyTokenJWT)

  // criate discount coupon
  fastifyApp.post(
    '/',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('SHOPKEEPER', 'ADMIN', 'SUPER')],
    },
    CreateDiscountCounpon,
  )

  // list discount couponn
  fastifyApp.get(
    '/',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('SHOPKEEPER','ADMIN', 'SUPER')],
    },
    ListDiscountCounpon,
  )

  // list discount coupo by shopkeeper
  fastifyApp.get(
    '/shopkeeper',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('SHOPKEEPER','ADMIN', 'SUPER')],
    },
    ListByShopkeeper,
  )

  // buscar cupom de desconto pelo id
  fastifyApp.get(
    '/:id',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('SHOPKEEPER','ADMIN', 'SUPER')],
    },
    FindDiscountCounponById,
  )

  // find discount coupon by code
  fastifyApp.get('/code/:code', FindDiscountCounponByCode)

  // deletar cupom de desconto pelo id
  fastifyApp.delete(
    '/:id',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('SHOPKEEPER','ADMIN', 'SUPER')],
    },
    DeleteDiscountCounpon,
  )

  // atualizar cupom de desconto pelo id
  fastifyApp.put(
    '/',
    {
      onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    },
    UpdateDiscountCounpon,
  )
}
