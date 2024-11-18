import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { UpdateCategoryUseCase } from "@/usecases/categories/update/update-categories-usecase"

export async function makeUpdateCategory(): Promise<UpdateCategoryUseCase> {
    const categoryRepository = new PrismaCategoryRepository()
    const updateCategoryUseCase = new UpdateCategoryUseCase(
        categoryRepository
    )

    return updateCategoryUseCase
}