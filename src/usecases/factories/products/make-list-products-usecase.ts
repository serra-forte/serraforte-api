import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ListProductsUseCase } from "@/usecases/products/list/list-products-usecase";

export async function makeListProduct(): Promise<ListProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const listProductsUseCase = new ListProductsUseCase(
        productsRepository
    )

    return listProductsUseCase
}