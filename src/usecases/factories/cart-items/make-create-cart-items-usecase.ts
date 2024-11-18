import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { CreateCartItemUseCase } from "@/usecases/cart-items/create/create-cart-item-usecase"

export async function makeCreateCartItem(): Promise<CreateCartItemUseCase> {
    const cartItemsRepository = new PrismaCartItemRepository()
    const productsRepository = new PrismaProductsRepository()
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const createCartItemUseCase = new CreateCartItemUseCase(
        shoppingCartsRepository,
        productsRepository,
        cartItemsRepository,
    )

    return createCartItemUseCase
}