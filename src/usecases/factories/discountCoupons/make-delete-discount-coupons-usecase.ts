import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { DeleteDiscountCounponUseCase } from '@/usecases/discountCoupons/delete/delete-discount-coupons-usecase'

export async function makeDeleteDiscountCoupon(): Promise<DeleteDiscountCounponUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const deleteDiscountCounponUseCase = new DeleteDiscountCounponUseCase(
    discountCounponRepository,
  )

  return deleteDiscountCounponUseCase
}
