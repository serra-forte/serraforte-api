import { RemoteConfigProviderFirebase } from "@/providers/RemoteConfigProvider/implementations/provider-remote-config";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateProductsUseCase } from "@/usecases/products/create/create-products-usecase";

export async function makeCreateProduct(): Promise<CreateProductsUseCase>{
    const remoteConfigProvider = new RemoteConfigProviderFirebase()
    const productsRepository = new PrismaProductsRepository()
    const categoriesRepository = new PrismaCategoryRepository()
    const usersRepository = new PrismaUsersRepository()

    const createProductsUseCase = new CreateProductsUseCase(
        productsRepository,
        categoriesRepository,
        usersRepository,
        remoteConfigProvider
    )

    return createProductsUseCase
}