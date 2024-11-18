import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { ListDiscountCounponByShopkeeperUseCase } from '@/usecases/discountCoupons/list-by-shopkeeper/list-byshopkeeper-discount-coupons-controller'

export async function makeListDiscountCouponByShopkeeper(): Promise<ListDiscountCounponByShopkeeperUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const listDiscountCounponByShopkeeperUseCase = new ListDiscountCounponByShopkeeperUseCase(
    discountCounponRepository,
  )

  return listDiscountCounponByShopkeeperUseCase
}
