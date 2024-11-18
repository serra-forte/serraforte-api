import { makeFindDiscountCouponByCode } from '@/usecases/factories/discountCoupons/make-find-by-code-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindDiscountCounponByCode(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCounponSchema = z.object({
      code: z.string(),
    })

    const { code } = discountCounponSchema.parse(request.params)

    const findDiscountCouponUseCase = await makeFindDiscountCouponByCode()

    const discountCoupons = await findDiscountCouponUseCase.execute({
      code,
      shopingCartId: request.user.shoppingCartId,
    })

    return reply.status(201).send(discountCoupons)
  } catch (error) {
    throw error
  }
}
