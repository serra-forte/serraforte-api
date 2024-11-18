import { ICategoriesRepository } from "@/repositories/interface-categories-repository"
import { Category } from "@prisma/client"

export class ListCategoryUseCase {
    constructor(
        private categoriesRepository: ICategoriesRepository,
        ) {}

    async execute(): Promise<Category[]>{
        // listar todas categorias
        const categories = await this.categoriesRepository.list()

        return categories
    }
}