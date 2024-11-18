import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ListProductsBySalesPublicUseCase } from "@/usecases/products/list-by-sales-public/list-by-sales-products-usecase";

export async function makeListProductBySalesPublic(): Promise<ListProductsBySalesPublicUseCase>{
    const productsRepository = new PrismaProductsRepository()

    const listProductsBySalesPublicUseCase = new ListProductsBySalesPublicUseCase(
        productsRepository
    )

    return listProductsBySalesPublicUseCase
}