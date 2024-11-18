import { DiscountCoupon, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { IDiscountCouponsRepository } from '../interfaces/interface-discount-coupons-repository'
import { IDiscountCouponRelations } from '@/dtos/discount-coupon-relations.dto'

export class PrismaDiscountCounpons implements IDiscountCouponsRepository {
  async listByShopkeerperId(id: string, page = 1) {
    const discountCoupons = await prisma.discountCoupon.findMany({
      skip: (page - 1) * 13,
      take: 13,
      where: {
        user: {
          id: id,
        },
      },
      select:{
        id: true,
        name: true,
        code: true,
        minValue: true,
        discount: true,
        expireDate: true,
        startDate: true,
        active: true,
        quantity: true,
        type: true,
      }
    }) as unknown as IDiscountCouponRelations[]
    
    const countPage = await prisma.discountCoupon.count({
      where: {
        user: {
          id: id,
        },
      },
    });

    // Calcular o total de páginas
    const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
    return {
        discountCoupons,
        totalPages
    }
  }
  async decrementQuantity(id: string): Promise<void> {
    await prisma.discountCoupon.update({
      where: { id },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })
  }
  async findById(id: string) {
    const discountCounpo = (await prisma.discountCoupon.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        minValue: true,
        discount: true,
        expireDate: true,
        startDate: true,
        active: true,
        quantity: true,
        type: true,
      },
    })) as unknown as DiscountCoupon

    return discountCounpo
  }
  async updateById(data: Prisma.DiscountCouponUncheckedUpdateInput) {
    const discountCounpo = (await prisma.discountCoupon.update({
      where: { id: data.id as string },
      data,
      select: {
        id: true,
        name: true,
        code: true,
        minValue: true,
        discount: true,
        expireDate: true,
        startDate: true,
        active: true,
        quantity: true,
        type: true,
      },
    })) as unknown as DiscountCoupon

    return discountCounpo
  }
  async delete(id: string) {
    await prisma.discountCoupon.delete({ where: { id } })
  }
  async list(page = 1) {
    const discountCoupons = await prisma.discountCoupon.findMany({
      skip: (page - 1) * 13,
      take: 13,
      select: {
        id: true,
        name: true,
        code: true,
        minValue: true,
        discount: true,
        expireDate: true,
        startDate: true,
        active: true,
        quantity: true,
        type: true,
        user:{
          select: {
            id: true,
            name: true,
          }
        }
        
      },
    }) as unknown as IDiscountCouponRelations[]

    const countPage = await prisma.discountCoupon.count();

    // Calcular o total de páginas
    const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
    return {
        discountCoupons,
        totalPages
    }
  }
  async findByCode(code: string) {
    const discountCounpo = (await prisma.discountCoupon.findUnique({
      where: { code },
      select: {
        id: true,
        name: true,
        code: true,
        minValue: true,
        discount: true,
        expireDate: true,
        startDate: true,
        active: true,
        quantity: true,
        type: true,
        userId: true,
        
      },
    })) as unknown as DiscountCoupon

    return discountCounpo
  }

  async create(data: Prisma.DiscountCouponUncheckedCreateInput) {
    const discountCounpo = await prisma.discountCoupon.create({ data })

    return discountCounpo
  }
}
