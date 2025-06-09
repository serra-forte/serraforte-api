import { IDiscountCouponsRepository } from "@/repositories/interfaces/interface-discount-coupons-repository";
import { CoupomServiceBase } from "./coupom.base";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found.error";
import { COUPOM_NOT_FOUND } from "@/usecases/errors/error-codes";
import { DiscountCoupon } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";
import { CoupomTypeEnum } from "@/enum/coupom-type.enum";

export class CoupomService implements CoupomServiceBase{
    constructor(
        private coupomRepository: IDiscountCouponsRepository,
    ){}
    async decrement(coupom: DiscountCoupon): Promise<boolean> {
        try{
            const decrementedQuantity = await this.coupomRepository.decrementQuantity(coupom.id)

            if(!decrementedQuantity) {
                throw new AppError('Erro ao decrementar o cupom', 500)
            }

            return true
        } catch (error) {
            throw error
        }
    }

    async check(coupomCode: string, total: number): Promise<DiscountCoupon> {
        try{
            const foundCoupom = await this.coupomRepository.findByCode(coupomCode)

            if(!foundCoupom) {
                throw new ResourceNotFoundError(COUPOM_NOT_FOUND)
            }

            const minValueForApply = Number(foundCoupom.minValue)


            if(foundCoupom.quantity === 0) {
                throw new AppError("Quantidade de cupons esgotada", 404)
            }

            if(minValueForApply > total) {
                throw new AppError("Cupom nao pode ser utilizado", 400)
            }

            return foundCoupom
        } catch (error) {
            throw error
        }
    }

    async apply(coupomCode: string, total: number): Promise<number> {
        try{
            const foundCoupom = await this.check(coupomCode, total)

            const discount = Number(foundCoupom.discount)

            await this.decrement(foundCoupom)

            return foundCoupom.type === CoupomTypeEnum.PERCENTAGE ? discount / 100 : discount
        } catch (error) {
            throw error
        }
    }
}