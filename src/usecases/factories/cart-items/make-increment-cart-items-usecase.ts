import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { IncrementCartItemUseCase } from "@/usecases/cart-items/increment/increment-cart-item-usecase"

export async function makeIncrementCartItem(): Promise<IncrementCartItemUseCase> {
    const cartItemsRepository = new PrismaCartItemRepository()
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const incrementCartItemUseCase = new IncrementCartItemUseCase(
        shoppingCartsRepository,
        cartItemsRepository,
    )

    return incrementCartItemUseCase
}