import { IFilterProducts, IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import formatKeyword from "@/utils/format-keyword";

export class FilterProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository
    ) {}

    async execute(filters: IFilterProducts) {
        let products = await this.productsRepository.filterProducts(filters)

        if(products.products.length === 0) {
            return products = await this.productsRepository.filterProducts({
                ...filters,
                name: filters.name ? await formatKeyword(filters.name) : null
            })
        }

        return products
    }
}