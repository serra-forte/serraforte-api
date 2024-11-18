import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ListByCategoryProductsUseCase } from "@/usecases/products/list-by-category/list-by-category-products-usecase";

export async function makeListByCategory(): Promise<ListByCategoryProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()
    const categoriesRepository = new PrismaCategoryRepository()

    const listByCategoryProductsUseCase = new ListByCategoryProductsUseCase(
        productsRepository,
        categoriesRepository
    )

    return listByCategoryProductsUseCase
}