import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { DeleteProductsUseCase } from "@/usecases/products/delete/delete-products-usecase";

export async function makeDeleteProduct(): Promise<DeleteProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const deleteProductsUseCase = new DeleteProductsUseCase(
        productsRepository
    )

    return deleteProductsUseCase
}