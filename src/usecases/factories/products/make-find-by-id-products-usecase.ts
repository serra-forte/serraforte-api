import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { FindProductUseCase } from "@/usecases/products/find-by-id/find-by-id-product-usecase";

export async function makeFindProduct(): Promise<FindProductUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const findProductUseCase = new FindProductUseCase(
        productsRepository,
    )

    return findProductUseCase
}