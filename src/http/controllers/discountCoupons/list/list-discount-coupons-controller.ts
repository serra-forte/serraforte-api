import { makeListDiscountCoupon } from '@/usecases/factories/discountCoupons/make-list-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function ListDiscountCounpon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const querySchema = z.object({
      page: z.coerce.number().optional().default(1),
    })

    const { page } = querySchema.parse(request.query)

    const listDiscountCouponUseCase = await makeListDiscountCoupon()

    const discountCoupons = await listDiscountCouponUseCase.execute({
      page
    })

    return reply.status(201).send(discountCoupons)
  } catch (error) {
    throw error
  }
}
