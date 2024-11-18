import { IProductsRepository, IResponseListProducts } from "@/repositories/interfaces/interface-products-repository"

export interface IRequestListProducts {
    page?: number | null
}

export class ListProductsBySalesPublicUseCase {
    constructor(
        private productsRepository: IProductsRepository,

    ){}

    async execute({
        page
    }: IRequestListProducts): Promise<IResponseListProducts> {
        // listar todos os produtos
        const products = await this.productsRepository.listBySales(page)

        return products
    }
}