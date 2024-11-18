import { DiscountCoupon } from '@prisma/client';
import { AppError } from '@/usecases/errors/app-error'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository'
import { IShoppingCartRepository } from '@/repositories/interfaces/interface-shopping-cart-repository'
import { IShoppingCartRelationsDTO } from '@/dtos/shopping-cart-relations.dto'

interface IRequestFindDiscountCoupon {
  code: string
  shopingCartId: string
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
    private shopingCartRepository: IShoppingCartRepository
  ) {}

  async execute({
    code,
    shopingCartId,
  }: IRequestFindDiscountCoupon): Promise<DiscountCoupon> {
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

    // buscar carrinho pelo id
    const findShoppingCart = await this.shopingCartRepository.findById(
      shopingCartId
    ) as unknown as IShoppingCartRelationsDTO

    // validar se o carrinho existe
    if (!findShoppingCart) {
      throw new AppError('Carrinho não encontrado', 404)
    }

    // validar se o userId do cupom é igual o item

    let itemsValue = 0
    let minValueToUseCoupon = Number(findCouponExist.minValue)
    let isValidToShopekeeper = false
    // percorrer os itens do carrinho
    const lastIndex = findShoppingCart.cartItem.length - 1;
    
    for (let index = 0; index < findShoppingCart.cartItem.length; index++) {
      let item = findShoppingCart.cartItem[index];
      
      // validar se o shopkeeperId do item é igual ao o userId do cupom
      if (item.userId === findCouponExist.userId) {
        // calcular valor dos itens do carrinho
        itemsValue += Number(item.price) * Number(item.quantity);

        isValidToShopekeeper = true
      }
    
      // verificar se é a ultima posição do item
      if (index === lastIndex) {
        // validar se existe algum cupom para os itens fo carrionho
        if(!isValidToShopekeeper){
          throw new AppError('Este cupom não é valido para os itens do carrinho', 404)
        }

        // verificar se o valor minimo do cupom para usar foi atingido
        if (itemsValue < minValueToUseCoupon) {
          throw new AppError(`O pedido deve atingir o mínimo de R$ ${minValueToUseCoupon}`, 400);
        }
      }
    }
    // retornar varial true ou false
    return findCouponExist
  }
}
