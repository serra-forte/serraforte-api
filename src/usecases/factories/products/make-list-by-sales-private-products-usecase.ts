import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ListProductsBySalesPrivateUseCase } from "@/usecases/products/list-by-sales-private/list-by-sales-products-usecase";

export async function makeListProductBySalesPrivate(): Promise<ListProductsBySalesPrivateUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const listProductsBySalesPrivateUseCase = new ListProductsBySalesPrivateUseCase(
        productsRepository
    )

    return listProductsBySalesPrivateUseCase
}