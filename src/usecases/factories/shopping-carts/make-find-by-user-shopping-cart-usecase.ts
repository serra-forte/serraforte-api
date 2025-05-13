import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository";
import { FindShoppingCartUseCase } from "@/usecases/shopping-carts/find-by-user/find-by-user-shopping-cart-usecase";

export async function makeFindByUserShoppingCart(): Promise<FindShoppingCartUseCase> {
    const shoppingCartsRepository = new PrismaShoppingCartRepository()
    const productRepository = new PrismaProductsRepository()
    const cartItemRepository = new PrismaCartItemRepository()

    const findShoppingCartUseCase = new FindShoppingCartUseCase(
        shoppingCartsRepository,
        productRepository,
        cartItemRepository
    )

    return findShoppingCartUseCase
}