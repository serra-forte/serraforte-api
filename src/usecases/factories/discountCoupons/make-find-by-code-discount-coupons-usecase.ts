import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { PrismaShoppingCartRepository } from '@/repositories/prisma/prisma-shopping-cart-repository'
import { FindDiscountCounponByCodeUseCase } from '@/usecases/discountCoupons/find-by-code/find-by-code-discount-coupons-usecase'

export async function makeFindDiscountCouponByCode(): Promise<FindDiscountCounponByCodeUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const dateProvider = new DayjsDateProvider()
  const shopingCartRepository = new PrismaShoppingCartRepository()

  const findDiscountCounponByCodeUseCase = new FindDiscountCounponByCodeUseCase(
    discountCounponRepository,
    dateProvider,
    shopingCartRepository
  )

  return findDiscountCounponByCodeUseCase
}
