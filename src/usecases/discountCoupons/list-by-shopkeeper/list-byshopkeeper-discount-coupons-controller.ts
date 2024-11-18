import 'dotenv/config'
import { IDiscountCouponsRepository, IResponseListDiscountCoupons } from '@/repositories/interfaces/interface-discount-coupons-repository'

interface IRequestListByShopkeerper{
  shopkeeperId: string
  page?: number | null
}

export class ListDiscountCounponByShopkeeperUseCase {
  constructor(private discountCoupon: IDiscountCouponsRepository) {}

  async execute({
    shopkeeperId,
    page
  }: IRequestListByShopkeerper): Promise<IResponseListDiscountCoupons> {
    // buscar todos os cupons de desconto
    const discountCoupons = await this.discountCoupon.listByShopkeerperId(shopkeeperId, page)

    // retornar os cupons de desconto
    return discountCoupons
  }
}
