import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository"
import { IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Review } from "@prisma/client"

export interface IRequestUpdateReviews{
    userId: string
    productId: string
    rating: number
    comment?: string | null
}

export class UpdateReviewsUseCase{
    constructor(
        private reviewsRepository: IReviewsRepository,
        private usersRepository: IUsersRepository,
        private productsRepository: IProductsRepository
    ){}

    async execute({
        userId, 
        productId, 
        rating, 
        comment
    }: IRequestUpdateReviews): Promise<Review>{
        // validar se o usuario existe
        const findUserExists = await this.usersRepository.findById(userId)

        // validar se o usuario existe
        if(!findUserExists){
            throw new AppError('Usuário nao encontrado', 404)
        }

        // buscar o produto pelo id
        const response = await this.productsRepository.findById(productId) as IResponseFindProductWithReviews

        const {
            product: findProductExists
        } = response


        // validar se o produto existe
        if(!findProductExists){
            throw new AppError('Produto não encontrado', 404)
        }

        const review = await this.reviewsRepository.update({
            userId,
            productId,
            rating,
            comment
        })

        return review
    }
}