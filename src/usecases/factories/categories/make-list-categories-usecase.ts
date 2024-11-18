import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { ListCategoryUseCase } from "@/usecases/categories/list/list-categories-usecase"

export async function makeListCategory(): Promise<ListCategoryUseCase> {
    const categoryRepository = new PrismaCategoryRepository()
    const listCategoryUseCase = new ListCategoryUseCase(
        categoryRepository
    )

    return listCategoryUseCase
}