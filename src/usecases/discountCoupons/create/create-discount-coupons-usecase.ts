import { AppError } from '@/usecases/errors/app-error'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'
import { DiscountCoupon } from '@prisma/client'

interface IRequestCreateDiscountCoupon {
  name: string
  code: string
  discount: number
  startDate: string
  expireDate: Date
  active: boolean
  quantity: number
  type: string
  userId: string
  minValue: number
}
export class CreateDiscountCounponUseCase {
  constructor(
    private discountCoupon: IDiscountCouponsRepository,
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute({
    name,
    code,
    discount,
    startDate,
    expireDate,
    active,
    quantity,
    type,
    userId,
    minValue
  }: IRequestCreateDiscountCoupon): Promise<DiscountCoupon> {
    // buscar se o coupon ja existe pelo code
    const couponAlreadyExists = await this.discountCoupon.findByCode(code)

    // validar se o coupon ja existe
    if (couponAlreadyExists) {
      throw new AppError('Já existe um cupom com esse código', 409)
    }

    // verificar se o coupons ja vai ser ativado
    if (active) {
      startDate = this.dayjsDateProvider.addDays(0)
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
    if(type !== 'PERCENTAGE' && minValue < discount ){
      throw new AppError('O valor minimo para uso do cupom deve ser maior que o desconto Fixo', 400)
    }

    // validar se a data inicial é anterior a data atual
    const compareStartDateBeforeDateNow = this.dayjsDateProvider.compareIfBefore(
      startDate,
      new Date(),
    )

    // validar se a data inicial é anterior a data atual
    if (!compareStartDateBeforeDateNow) {
      throw new AppError('A data inicial do cupom não pode ser anterior a data de hoje', 400)
    }

    // criar a discount coupon
    const discountCoupon = await this.discountCoupon.create({
      userId,
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
