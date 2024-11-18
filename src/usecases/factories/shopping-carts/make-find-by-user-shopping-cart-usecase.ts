import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository";
import { FindShoppingCartUseCase } from "@/usecases/shopping-carts/find-by-user/find-by-user-shopping-cart-usecase";

export async function makeFindByUserShoppingCart(): Promise<FindShoppingCartUseCase> {
    const shoppingCartsRepository = new PrismaShoppingCartRepository()

    const findShoppingCartUseCase = new FindShoppingCartUseCase(
        shoppingCartsRepository,
    )

    return findShoppingCartUseCase
}