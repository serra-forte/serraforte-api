import { ICategoriesRepository } from "@/repositories/interfaces/interface-categories-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Category } from "@prisma/client"

interface IRequestUpdateCategory{
    id: string
    name: string
    description?: string
    color?: string
    image?: string
}

export class UpdateCategoryUseCase {
    constructor(
        private categoriesRepository: ICategoriesRepository,
        ) {}

    async execute({
        id,
        name,
        description,
        color,
        image
    }: IRequestUpdateCategory): Promise<Category>{
        // buscar categoria pelo id
        const findCategoryExists = await this.categoriesRepository.findById(id)

        // validar se existe categoria com o mesmo idd
        if(!findCategoryExists){
            throw new AppError('Categoria não encontrada', 404)
        }
        // verificar se categoria existe com o mesmo nome
        const categoryAlreadyExists = await this.categoriesRepository.findByName(name)

        // validar se existe categoria com o mesmo nome
        if(categoryAlreadyExists && findCategoryExists.id !== categoryAlreadyExists.id){
            throw new AppError('Categoria ja existe', 409)
        }

        // atualizar categoria
        const category = await this.categoriesRepository.updateById({
            id,
            name,
            description,
            color,
            image
        })

        // retornar categoria
        return category
    }
}