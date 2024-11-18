import { ICategoriesRepository } from "@/repositories/interfaces/interface-categories-repository"
import { IProductsRepository, IResponseListProducts } from "@/repositories/interfaces/interface-products-repository"
import { AppError } from "@/usecases/errors/app-error"

interface ListByCategoryProductsUseCaseRequest {
    id: string
    page?: number | null
}

export class ListByCategoryProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository,
        private categoriesRepository: ICategoriesRepository
    ){}

    async execute({
        id,
        page
    }: ListByCategoryProductsUseCaseRequest): Promise<IResponseListProducts> {
        // buscar categoria pelo id
        const findCategoryExists = await this.categoriesRepository.findById(id)

        // validar se existe categoria com o mesmo id
        if(!findCategoryExists){
            throw new AppError('Categoria nao encontrada', 404)
        }

        // listar todos os produtos
        const products = await this.productsRepository.listByCategoryId(id, page)

        return products
    }
}