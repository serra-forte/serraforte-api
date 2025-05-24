import { PrismaStoreRepository } from "@/repositories/prisma/prisma-store-repository"
import { ListStoreUseCase } from "@/usecases/stores/list/list-store-usecase"

export async function makeListStore(): Promise<ListStoreUseCase> {
    const storeRepository = new PrismaStoreRepository()
    const listStoreUseCase = new ListStoreUseCase(storeRepository)
    return listStoreUseCase
}