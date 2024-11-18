import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { FindCategoryUseCase } from "@/usecases/categories/find-by-id/find-by-id-categories-usecase"

export async function makeFindCategory(): Promise<FindCategoryUseCase> {
    const categoryRepository = new PrismaCategoryRepository()
    const findCategoryUseCase = new FindCategoryUseCase(
        categoryRepository
    )

    return findCategoryUseCase
}