import { DiscountCoupon } from '@prisma/client';
import { AppError } from '@/usecases/errors/app-error'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'
import { IShoppingCartRepository } from '@/repositories/interfaces/interface-shopping-cart-repository'
import { IShoppingCartRelationsDTO } from '@/dtos/shopping-cart-relations.dto'

interface IRequestFindDiscountCoupon {
  code: string
}

export interface CouponFormatted {
  id: string
  name: string
  code: string
  discount: number
  startDate: Date
  expireDate: Date
  active: boolean
  quantity: number
  type: string
}

export class FindDiscountCounponByCodeUseCase {
  constructor(
    private discountCoupon: IDiscountCouponsRepository,
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    code,
  }: IRequestFindDiscountCoupon): Promise<boolean> {
    // buscar se o coupon ja existe pelo code
    const findCouponExist = await this.discountCoupon.findByCode(
      code,
    )

    // validar se o coupon ja existe
    if (!findCouponExist) {
      throw new AppError('Cupom não encontrado', 404)
    }

    // validar se cupom esta ativo
    if (!findCouponExist.active) {
      throw new AppError('Cupom inativo', 400)
    }

    if(Number(findCouponExist.quantity) <= 0){
      throw new AppError('Cupom esgotado', 401)
    }

    const currentDate = new Date()

    const isValidCoupon = this.dateProvider.compareIfBefore(
      currentDate,
      findCouponExist.expireDate,
    )

    // validar se o coupon expirou
    if (!isValidCoupon) {
      throw new AppError('Cupom expirado', 410)
    }

    // retornar varial true ou false
    return true
  }
}
