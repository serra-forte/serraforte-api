import { makeFindDiscountCouponById } from '@/usecases/factories/discountCoupons/make-find-by-id-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function FindDiscountCounponById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCounponSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = discountCounponSchema.parse(request.params)

    const findDiscountCouponUseCase = await makeFindDiscountCouponById()

    const discountCoupons = await findDiscountCouponUseCase.execute({
      id,
    })

    return reply.status(201).send(discountCoupons)
  } catch (error) {
    throw error
  }
}
