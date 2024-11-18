import { ICartItemRelationsDTO } from "@/dtos/cart-item-relations.dto";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestDeleteCartItem {
    id: string
    shoppingCartId: string
}

export class DeleteCartItemUseCase {
    constructor(
        private cartItemRepository: ICartItemRepository,
        private shoppingCartsRepository: IShoppingCartRepository
    ) {}

    async execute({
         id,
         shoppingCartId
    }: IRequestDeleteCartItem):Promise<void> {
        // buscar cartitem pelo id
        const findCartItemExists = await this.cartItemRepository.findById(id) as unknown as ICartItemRelationsDTO

        // validar se cartitem existe
        if(!findCartItemExists){
            throw new AppError('Item não encontrado', 404)
        }
        // buscar carrinho pelo id
        const findShoppingCartExists = await this.shoppingCartsRepository.findById(shoppingCartId)

        // validar se carrinho existe
        if(!findShoppingCartExists){
            throw new AppError('Carrinho não encontrado', 404)
        }

        let total = Math.abs(Number(findCartItemExists.price) * Number(findCartItemExists.quantity) - Number(findShoppingCartExists.total))
        
        // atualizar total do carrinho
        await this.shoppingCartsRepository.updateTotal(shoppingCartId, total)

        // deletar cartitem pelo id
        await this.cartItemRepository.deleteById(id)

    }
}