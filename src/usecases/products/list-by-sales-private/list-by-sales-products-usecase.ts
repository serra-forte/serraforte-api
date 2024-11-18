import { IProductsRepository, IResponseListProducts } from "@/repositories/interfaces/interface-products-repository"

export interface IRequestListProducts {
    shopkeeperId: string
    page?: number | null
}

export class ListProductsBySalesPrivateUseCase {
    constructor(
        private productsRepository: IProductsRepository,

    ){}

    async execute({
        shopkeeperId,
        page
    }: IRequestListProducts): Promise<IResponseListProducts> {
        // buscar todos os produtos pelo id do shopkeeper
        // buscar user pelo id
        const products = await this.productsRepository.listBySalesAndShopkeeperId(shopkeeperId, page)

        return products
}
}