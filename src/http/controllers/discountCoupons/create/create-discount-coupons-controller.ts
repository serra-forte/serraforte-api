import { makeCreateDiscountCoupon } from '@/usecases/factories/discountCoupons/make-create-discount-coupons-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateDiscountCounpon(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const discountCouponSchemaBody = z.object({
      name: z.string(),
      code: z.string(),
      discount: z.number().positive(),
      startDate: z.string(),
      expireDate: z.string(),
      active: z.boolean(),
      quantity: z.number().positive().int(),
      type: z.enum(['FIXED', 'PERCENTAGE']),
      minValue: z.number().positive(),
    })

    const { name, code, discount, expireDate, startDate, active, quantity, type, minValue } =
      discountCouponSchemaBody.parse(request.body)

    const createDiscountCouponUseCase = await makeCreateDiscountCoupon()

    // formatar as datas com o formato aaaa-mm-dd
    const startDateFormat = startDate.split('/').reverse().join('-')
    const expireDateFormat = expireDate.split('/').reverse().join('-')
  

    const discountCoupon = await createDiscountCouponUseCase.execute({
      userId: request.user.id,
      name,
      code,
      discount,
      startDate: startDateFormat,
      expireDate: new Date(expireDateFormat),
      active,
      quantity,
      type,
      minValue,
    })

    return reply.status(201).send(discountCoupon)
  } catch (error) {
    throw error
  }
}
