import 'dotenv/config'
import { DiscountCoupon } from '@prisma/client'
import { AppError } from '@/usecases/errors/app-error'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'

interface IRequestUpdateDiscountCoupon {
  id: string
  name: string
  code: string
  discount: number
  startDate: Date
  expireDate: Date
  active: boolean
  quantity: number
  type: string
  minValue: number
}
export class UpdateDiscountCounponUseCase {
  constructor(
    private discountCoupon: IDiscountCouponsRepository,
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute({
    id,
    name,
    code,
    discount,
    startDate,
    expireDate,
    active,
    quantity,
    minValue,
    type
  }: IRequestUpdateDiscountCoupon): Promise<DiscountCoupon> {
    // buscar se o coupon ja existe pelo code
    const couponAlreadyExists = await this.discountCoupon.findById(id)

    // validar se o coupon ja existe
    if (!couponAlreadyExists) {
      throw new AppError('Cupom não encontrado', 404)
    }

    // verificar se a data de expiração é anterior que a data de inicio
    const compareDate = this.dayjsDateProvider.compareIfBefore(
      startDate,
      expireDate,
    )

    // validar se a data de expiração é anterior que a data de inicio
    if (!compareDate) {
      throw new AppError(
        'A data de expiração não pode ser anterior que a data de inicio',
        400,
      )
    }

    // verificar se o valor minimo para uso do cupom é maior que o desconto
    if (minValue < discount) {
      throw new AppError('O valor minimo para uso do cupom deve ser maior que o desconto', 400)
    }

    // criar a discount coupon
    const discountCoupon = await this.discountCoupon.updateById({
      id,
      name,
      code,
      discount,
      startDate,
      expireDate,
      active,
      quantity,
      type,
      minValue
    })

    // retornar a discount coupon
    return discountCoupon
  }
}
