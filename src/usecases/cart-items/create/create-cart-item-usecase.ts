import { IProductRelationsDTO } from './../../../dtos/product-relations.dto';
import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";
import { CartItem, ShoppingCart } from "@prisma/client";

export interface IRequestCreateCartItem {
    shoppingCartId: string
    cartItem: {
        productId: string
        quantity: number
    }[]
}

export class CreateCartItemUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
        private productRepository: IProductsRepository,
        private cartItemRepository: ICartItemRepository
    ) {}

    async execute({
        shoppingCartId,
        cartItem
    }: IRequestCreateCartItem): Promise<IShoppingCartRelationsDTO | CartItem>{
        // validar se o carrinho existe
        const shoppingCart = await this.shoppingCartsRepository.findById(shoppingCartId) as unknown as IShoppingCartRelationsDTO

        // validar se o carrinho existe
        if(!shoppingCart){
            throw new AppError('Carrinho não encontrado', 404)
        }

        let total = 0;

        // for para percorrer os itens do carrinho
        for(const item of cartItem){
             // validar se o produto existe
            const responseFindProduct = await this.productRepository.findById(item.productId) as IResponseFindProductWithReviews

            const {
                product
            } = responseFindProduct

            // validar se o produto existe
            if(!product){
                throw new AppError('Produto não encontrado', 404)
            }

            // percorrer itens do carrinho para verificar se o item ja existe
            const cartItemExists = shoppingCart.cartItem.find(cartItem => cartItem.name === product.name)


            const value = Number(product.price)
            
            // validar se o item do carrinho existe
            if(cartItemExists){
                // incrementar item do carrinho
                const cartItem = await this.cartItemRepository.incrementCartItemById(cartItemExists.id, value)
                return cartItem
            }

            // verificar se o produto esta ativo
            if(!product.active){
                throw new AppError('Produto não encontrado', 404)
            }

            // verificar produto no esoque
            if(product.quantity < 1){
                throw new AppError('Produto esgotado', 400);
            }

            // criar item do carrinho
            await this.cartItemRepository.create({
                productId: product.id,
                shoppingCartId,
                userId: product.user.id,
                quantity: item.quantity,
                height: product.height,
                length: product.length,
                width: product.width,
                weight: product.weight,
                price: product.price,
                mainImage: product.mainImage
            })
            total += Number(product.price) * Number(item.quantity) + Number(shoppingCart.total)

            // atualizar total do carrinho
            await this.shoppingCartsRepository.updateTotal(shoppingCart.id, total)

        }

        // validar se o carrinho existe
        const shoppingCartUpdated = await this.shoppingCartsRepository.findById(shoppingCartId) as unknown as IShoppingCartRelationsDTO
        
        return shoppingCartUpdated
    }
}