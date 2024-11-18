import { ICategoriesRepository } from "@/repositories/interfaces/interface-categories-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Category } from "@prisma/client"

interface IRequestFindCategory{
    id: string
}

export class FindCategoryUseCase {
    constructor(
        private categoriesRepository: ICategoriesRepository,
        ) {}

    async execute({
        id
    }: IRequestFindCategory): Promise<Category>{
        // buscar categoria pelo id
        const findCategoryExist = await this.categoriesRepository.findById(id)

        // validar se existe categoria com o mesmo id
        if(!findCategoryExist){
            throw new AppError('Category not found', 404)
        }

        // retornar categoria
        return findCategoryExist
    }
}