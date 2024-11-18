import { ICartItemRelationsDTO } from "@/dtos/cart-item-relations.dto";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";
import { CartItem } from "@prisma/client";

export interface IRequestIncrementCartItem {
    id: string
    shoppingCartId: string
}

export class IncrementCartItemUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
        private cartItemRepository: ICartItemRepository
    ) {}

    async execute({
         id,
         shoppingCartId
    }: IRequestIncrementCartItem): Promise<CartItem>{
        // buscar cartItem pelo id
        const findCartItemExists = await this.cartItemRepository.findById(id) as unknown as ICartItemRelationsDTO

        // validar se cartItem existe
        if(!findCartItemExists){
            throw new AppError('Item do carrinho não encontrado', 404)
        }

        // buscar carrinho pelo id
        const findShoppingCartExists = await this.shoppingCartsRepository.findById(shoppingCartId)

        // validar se carrinho existe
        if(!findShoppingCartExists){
            throw new AppError('Carrinho não encontrado', 404)
        }
        let value = Number(findCartItemExists.price)
        // incrementar item do carrinho
        const cartItem = await this.cartItemRepository.incrementCartItemById(id, value)

        return cartItem
    }
}