import { IProductsRepository, IResponseListProducts } from "@/repositories/interfaces/interface-products-repository"
import { Product } from "@prisma/client"

export interface IListProductsUseCase {
    page?: number | null
}

export class ListProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository
    ){}

    async execute({
        page
    }: IListProductsUseCase): Promise<IResponseListProducts> {
        // listar todos os produtos
        const products = await this.productsRepository.list(page)

        return products
    }
}