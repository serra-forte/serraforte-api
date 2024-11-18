import { makeUpdateDiscountCoupon } from '@/usecases/factories/discountCoupons/make-update-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateDiscountCounpon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCouponSchemaBody = z.object({
      id: z.string().uuid(),
      name: z.string(),
      code: z.string(),
      discount: z.number().positive(),
      startDate: z.string(),
      expireDate: z.string(),
      active: z.boolean(),
      quantity: z.number().min(0).int(),
      type: z.enum(['FIXED', 'PERCENTAGE']),
      minValue: z.number().positive(),
    })

    const { id, name, code, discount, expireDate, startDate, active, quantity, type, minValue } =
      discountCouponSchemaBody.parse(request.body)

    const updateDiscountCouponUseCase = await makeUpdateDiscountCoupon()

    const discountCoupon = await updateDiscountCouponUseCase.execute({
      id,
      name,
      code,
      discount,
      startDate: new Date(startDate),
      expireDate: new Date(expireDate),
      active,
      quantity,
      type,
      minValue
    })

    return reply.status(201).send(discountCoupon)
  } catch (error) {
    throw error
  }
}
