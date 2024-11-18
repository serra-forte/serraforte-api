import { IDiscountCouponRelations } from '@/dtos/discount-coupon-relations.dto'
import { DiscountCoupon, Prisma } from '@prisma/client'

export interface IResponseListDiscountCoupons {
  discountCoupons: IDiscountCouponRelations[]
  totalPages: number
}

export interface IDiscountCouponsRepository {
  create(data: Prisma.DiscountCouponUncheckedCreateInput): Promise<DiscountCoupon>
  findByCode(code: string): Promise<DiscountCoupon | null>
  findById(id: string): Promise<DiscountCoupon | null>
  list(page?: number | null): Promise<IResponseListDiscountCoupons>
  listByShopkeerperId(id: string, page?: number | null): Promise<IResponseListDiscountCoupons>
  updateById(data: Prisma.DiscountCouponUncheckedUpdateInput): Promise<DiscountCoupon>
  decrementQuantity(id: string): Promise<void>
  delete(id: string): Promise<void>
}
