import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { DeleteAllCartItemUseCase } from "@/usecases/cart-items/delete-all/delete-all-cart-item-usecase"

export async function makeDeleteAllCartItem(): Promise<DeleteAllCartItemUseCase> {
    const cartItemsRepository = new PrismaCartItemRepository()
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const deleteAllCartItemUseCase = new DeleteAllCartItemUseCase(
        shoppingCartsRepository,
        cartItemsRepository,
    )

    return deleteAllCartItemUseCase
}