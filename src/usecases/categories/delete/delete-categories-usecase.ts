import { ICategoriesRepository } from "@/repositories/interface-categories-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Category } from "@prisma/client"

interface IRequestDeleteCategory{
    id: string
}

export class DeleteCategoryUseCase {
    constructor(
        private categoriesRepository: ICategoriesRepository,
        ) {}

    async execute({
        id
    }: IRequestDeleteCategory): Promise<Category>{
        // buscar categoria pelo id
        const findCategoryExist = await this.categoriesRepository.findById(id)

        // validar se existe categoria com o mesmo id
        if(!findCategoryExist){
            throw new AppError('Category not found', 404)
        }

        // delete categoria pelo id
        await this.categoriesRepository.deleteById(id)

        // retornar categoria
        return findCategoryExist
    }
}