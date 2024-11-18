import { AppError } from '@/usecases/errors/app-error'
import { DiscountCoupon } from '@prisma/client'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'

interface IRequestFindDiscountCoupon {
  id: string
}
export class FindDiscountCounponUseCase {
  constructor(private discountCoupon: IDiscountCouponsRepository) {}

  async execute({ id }: IRequestFindDiscountCoupon): Promise<DiscountCoupon> {
    // buscar se o coupon ja existe pelo code
    const findCouponExist = await this.discountCoupon.findById(id)

    // validar se o coupon ja existe
    if (!findCouponExist) {
      throw new AppError('Camping não encontrado', 404)
    }

    // retornar discount coupon
    return findCouponExist
  }
}
