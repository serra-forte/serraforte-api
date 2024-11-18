import { IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Review } from "@prisma/client"

export interface IRequestFindReviews{
    reviewId: string
}

export class FindByIdReviewsUseCase{

    constructor(
        private reviewsRepository: IReviewsRepository,
    ){}

    async execute({
        reviewId 
    }: IRequestFindReviews): Promise<Review>{
        // buscar reviews pelo id
        const findReviewsExists = await this.reviewsRepository.findById(reviewId)

        // validar se reviews existe pelo id
        if(!findReviewsExists){
            throw new AppError('Avaliação não encontrado', 404)
        }

        // retornar reviews
        return findReviewsExists
    }
}