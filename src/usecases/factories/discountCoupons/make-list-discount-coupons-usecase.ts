import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { ListDiscountCounponUseCase } from '@/usecases/discountCoupons/list/list-discount-coupons-usecase'

export async function makeListDiscountCoupon(): Promise<ListDiscountCounponUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const listDiscountCounponUseCase = new ListDiscountCounponUseCase(
    discountCounponRepository,
  )

  return listDiscountCounponUseCase
}
