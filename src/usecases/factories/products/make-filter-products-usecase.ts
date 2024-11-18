import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { FilterProductsUseCase } from "@/usecases/products/filter/filter-products-usecase";

export async function makeFilterProduct(): Promise<FilterProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const filterProductsUseCase = new FilterProductsUseCase(
        productsRepository,
    )

    return filterProductsUseCase
}