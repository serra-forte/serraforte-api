import { makeListDiscountCouponByShopkeeper } from '@/usecases/factories/discountCoupons/make-list-by-shopkeeper-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListByShopkeeper(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCounponSchema = z.object({
      id: z.string().uuid(),
      page: z.coerce.number().optional().default(1),
    })

    const { id, page } = discountCounponSchema.parse(request.params)

    const listDiscountCouponUseCase = await makeListDiscountCouponByShopkeeper()

    const discountCoupons = await listDiscountCouponUseCase.execute({
      shopkeeperId: id,
      page
    })

    return reply.status(201).send(discountCoupons)
  } catch (error) {
    throw error
  }
}
