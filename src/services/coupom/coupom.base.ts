import { DiscountCoupon } from "@prisma/client";

export abstract class CoupomServiceBase{
    abstract check(coupomCode: string, total: number): Promise<DiscountCoupon>
    abstract apply(coupomCode: string, total: number): Promise<number>
    abstract decrement(coupom: DiscountCoupon): Promise<boolean>
}