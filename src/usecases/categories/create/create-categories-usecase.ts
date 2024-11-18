import { ICategoriesRepository } from "@/repositories/interfaces/interface-categories-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Category } from "@prisma/client"

interface IRequestCreateCategory{
    name: string
    description?: string
    color: string
    image: string
}

export class CreateCategoryUseCase {
    constructor(
        private categoriesRepository: ICategoriesRepository,
        ) {}

    async execute({
        name,
        description,
        color,
        image
    }: IRequestCreateCategory): Promise<Category>{
        // verificar se categoria existe com o mesmo nome
        const categoryAlreadyExists = await this.categoriesRepository.findByName(name)

        // validar se existe categoria com o mesmo nome
        if(categoryAlreadyExists){
            throw new AppError('Categoria ja existe', 409)
        }

        // criar categoria
        const category = await this.categoriesRepository.create({
            name,
            description,
            color,
            image
        })

        // retornar categoria
        return category
    }
}