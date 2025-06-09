import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { ShoppingCartServiceBase } from "./shopping-cart.base";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { AppError } from "@/usecases/errors/app-error";
import { CART_NOT_FOUND } from "@/usecases/errors/error-codes";
import { CartItem } from "@prisma/client";

export class ShoppingCartService implements ShoppingCartServiceBase{
    constructor(
        private shoppingCartRepository: IShoppingCartRepository,
        private cartItemRepository: ICartItemRepository,
    ) {}

    async getItems(userId: string): Promise<CartItem[]> {
        try{
            const result = await this.shoppingCartRepository.findByUserId(userId)
            if(!result){
                throw new AppError(CART_NOT_FOUND)
            }
            return result.cartItem as unknown as CartItem[]
        } catch (error) {
            throw error
        }
    }

    async clear(shoppingCartId: string): Promise<boolean> {
        try{
            const deletedCartItems = await this.cartItemRepository.deleteAllCartItemByShoppingCartId(shoppingCartId)

            if(!deletedCartItems){
                throw new AppError('Erro ao limpar o carrinho', 500)
            }

            return true
        } catch (error) {
            throw error
        }
    }

    async getTotal(userId: string): Promise<number> {
        try{
            const foundShoppingCart = await this.shoppingCartRepository.findByUserId(userId)

            if(!foundShoppingCart){
                throw new AppError(CART_NOT_FOUND)
            }

            const total = Number(foundShoppingCart.total)

            return total
        } catch (error) {
            throw error
        }
    }
}