import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestFindShoppingCart {
    id: string
}

export class FindShoppingCartUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
        private productRepository: IProductsRepository,
        private cartItemRepository: ICartItemRepository
    ) {}

    async execute({
         id,
    }: IRequestFindShoppingCart):Promise<IShoppingCartRelationsDTO> {
        // buscar carrinho pelo id
        const findShoppingCartExists = await this.shoppingCartsRepository.findByUserId(id)

        // validar se carrinho existe
        if(!findShoppingCartExists){
            throw new AppError('Carrinho não encontrado')
        }

        let total = 0;

        for(const item of findShoppingCartExists.cartItem){
            // buscar produto pelo id
            const findProductExists = await this.productRepository.findById(item.productId)

            // validar se produto existe
            if(!findProductExists){
                throw new AppError('Produto nao encontrado')
            }

            item.price = Number(findProductExists.product.price)

            await this.cartItemRepository.updatePrice(item.id, item.price)

            total += Math.abs(Number(item.price) * Number(item.quantity))
        }   

        findShoppingCartExists.total = total

        // retornar carrinho
        return findShoppingCartExists
    }
}