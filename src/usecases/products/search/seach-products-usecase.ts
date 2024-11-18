import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import formatKeyword from "@/utils/format-keyword";

export interface IRequestSearchProducts {
    keyword: string
}

export class SearchProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository
    ) {}

    async execute({keyword}: IRequestSearchProducts) {
        let keyFormated = keyword;

        const responseSearch = await this.productsRepository.searchProducts(keyFormated)

        if(responseSearch.products.length === 0) {
            keyFormated = await formatKeyword(keyword);

            return await this.productsRepository.searchProducts(keyFormated)
        }

        return responseSearch

    }
}