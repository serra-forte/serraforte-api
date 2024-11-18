import { IProductRelationsDTO } from "@/dtos/product-relations.dto"
import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Product } from "@prisma/client"

interface IRequestFindProduct{
    id: string
    page: number
}

export class FindProductUseCase {
    constructor(
        private productRepository: IProductsRepository,
        ) {}

    async execute({
        id,
        page
    }: IRequestFindProduct): Promise<IResponseFindProductWithReviews>{
        // buscar produto pelo id
        const responseFindProduct = await this.productRepository.findById(id, page) as IResponseFindProductWithReviews

        // validar se existe produto com o mesmo id
        if(!responseFindProduct.product){
            throw new AppError('Produto não encontrado', 404)
        }

        // retornar produto
        return responseFindProduct
    }
}