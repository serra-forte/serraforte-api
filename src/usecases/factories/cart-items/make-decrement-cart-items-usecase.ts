import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { DecrementCartItemUseCase } from "@/usecases/cart-items/decrement/decrement-cart-item-usecase"

export async function makeDecrementCartItem(): Promise<DecrementCartItemUseCase> {
    const cartItemsRepository = new PrismaCartItemRepository()
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const decrementCartItemUseCase = new DecrementCartItemUseCase(
        shoppingCartsRepository,
        cartItemsRepository,
    )

    return decrementCartItemUseCase
}