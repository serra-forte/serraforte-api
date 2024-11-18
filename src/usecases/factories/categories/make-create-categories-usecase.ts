import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { CreateCategoryUseCase } from "@/usecases/categories/create/create-categories-usecase"

export async function makeCreateCategory(): Promise<CreateCategoryUseCase> {
    const categoryRepository = new PrismaCategoryRepository()
    const createCategoryUseCase = new CreateCategoryUseCase(
        categoryRepository
    )

    return createCategoryUseCase
}