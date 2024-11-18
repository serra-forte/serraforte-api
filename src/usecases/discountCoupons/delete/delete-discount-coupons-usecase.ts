import { AppError } from '@/usecases/errors/app-error'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'

interface IRequestDeleteDiscountCoupon {
  id: string
}
export class DeleteDiscountCounponUseCase {
  constructor(private discountCoupon: IDiscountCouponsRepository) {}

  async execute({ id }: IRequestDeleteDiscountCoupon): Promise<void> {
    // buscar se o coupon ja existe pelo code
    const findCoupon = await this.discountCoupon.findById(id)

    // validar se o coupon ja existe
    if (!findCoupon) {
      throw new AppError('Cupom não encontrado', 404)
    }

    // delete discount coupon
    await this.discountCoupon.delete(id)
  }
}
