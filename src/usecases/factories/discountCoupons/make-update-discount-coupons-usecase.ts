import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { PrismaDiscountCounpons } from '@/repositories/prisma/prisma-discount-counpons-repository'
import { UpdateDiscountCounponUseCase } from '@/usecases/discountCoupons/update/update-discount-coupons-usecase'

export async function makeUpdateDiscountCoupon(): Promise<UpdateDiscountCounponUseCase> {
  const discountCounponRepository = new PrismaDiscountCounpons()
  const dateProvider = new DayjsDateProvider()
  const updateDiscountCounponUseCase = new UpdateDiscountCounponUseCase(
    discountCounponRepository,
    dateProvider,
  )

  return updateDiscountCounponUseCase
}
