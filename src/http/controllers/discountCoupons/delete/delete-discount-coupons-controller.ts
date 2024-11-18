import { makeDeleteDiscountCoupon } from '@/usecases/factories/discountCoupons/make-delete-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function DeleteDiscountCounpon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCounponSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = discountCounponSchema.parse(request.params)

    const deleteDiscountCouponUseCase = await makeDeleteDiscountCoupon()

    await deleteDiscountCouponUseCase.execute({
      id,
    })

    return reply.status(200).send({ message: 'Coupom deleted with success!'})
  } catch (error) {
    throw error
  }
}
