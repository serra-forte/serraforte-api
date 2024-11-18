import 'dotenv/config'
import { IDiscountCouponsRepository, IResponseListDiscountCoupons } from '@/repositories/interfaces/interface-discount-coupons-repository'

interface IRequestListDiscountCounponUseCase {
  page?: number | null
}

export class ListDiscountCounponUseCase {
  constructor(private discountCoupon: IDiscountCouponsRepository) {}

  async execute({
    page
  }: IRequestListDiscountCounponUseCase): Promise<IResponseListDiscountCoupons> {
    // buscar todos os cupons de desconto
    const discountCoupons = await this.discountCoupon.list(page)

    // retornar os cupons de desconto
    return discountCoupons
  }
}
