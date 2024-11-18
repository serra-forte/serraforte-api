import { ICartItemRelationsDTO } from "@/dtos/cart-item-relations.dto";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";
import { CartItem } from "@prisma/client";

export interface IRequestDecrementCartItem {
    id: string
    shoppingCartId: string
}

export class DecrementCartItemUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
        private cartItemRepository: ICartItemRepository
    ) {}

    async execute({
         id,
         shoppingCartId
    }: IRequestDecrementCartItem): Promise<CartItem | null>{
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

        
        if(findCartItemExists.quantity === 1){
            let total = Number(findShoppingCartExists.total) - Number(findCartItemExists.price)

            await this.shoppingCartsRepository.updateTotal(findShoppingCartExists.id, total)
            
            // deletar item do carrinho
            await this.cartItemRepository.deleteById(id)

            return null
        }

        let value = Number(findCartItemExists.price)

        // incrementar item do carrinho
        const cartItem = await this.cartItemRepository.decrementCartItemById(id, value)

        return cartItem
    }
}