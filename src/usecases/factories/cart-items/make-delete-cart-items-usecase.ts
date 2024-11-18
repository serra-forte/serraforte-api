import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { DeleteCartItemUseCase } from "@/usecases/cart-items/delete/delete-cart-item-usecase"

export async function makeDeleteCartItem(): Promise<DeleteCartItemUseCase> {
    const cartItemsRepository = new PrismaCartItemRepository()
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const deleteCartItemUseCase = new DeleteCartItemUseCase(
        cartItemsRepository,
        shoppingCartsRepository
    )

    return deleteCartItemUseCase
}