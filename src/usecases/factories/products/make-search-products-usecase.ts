import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { SearchProductsUseCase } from "@/usecases/products/search/seach-products-usecase";

export async function makeSearchProduct(): Promise<SearchProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const searchProductsUseCase = new SearchProductsUseCase(
        productsRepository,
    )

    return searchProductsUseCase
}