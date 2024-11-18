import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { FindDiscountCounponUseCase } from '@/usecases/discountCoupons/find-by-id/find-by-id-discount-coupons-usecase'

export async function makeFindDiscountCouponById(): Promise<FindDiscountCounponUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const findDiscountCounponUseCase = new FindDiscountCounponUseCase(
    discountCounponRepository,
  )

  return findDiscountCounponUseCase
}
