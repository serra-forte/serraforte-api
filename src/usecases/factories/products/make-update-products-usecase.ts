import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateProductsUseCase } from "@/usecases/products/update/update-products-usecase";

export async function makeUpdateProduct(): Promise<UpdateProductsUseCase>{
    const productsRepository = new PrismaProductsRepository()
    const usersRepository = new PrismaUsersRepository()

    const updateProductsUseCase = new UpdateProductsUseCase(
        productsRepository,
        usersRepository
    )

    return updateProductsUseCase
}