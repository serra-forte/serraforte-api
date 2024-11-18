import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { DeleteCategoryUseCase } from "@/usecases/categories/delete/delete-categories-usecase"

export async function makeDeleteCategory(): Promise<DeleteCategoryUseCase> {
    const categoryRepository = new PrismaCategoryRepository()
    const deleteCategoryUseCase = new DeleteCategoryUseCase(
        categoryRepository
    )

    return deleteCategoryUseCase
}