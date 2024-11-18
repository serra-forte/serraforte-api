import { IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository"
import { AppError } from "@/usecases/errors/app-error"

export interface IRequestApproveReviews{
    reviewId: string
    approved: boolean
}

export class ApproveReviewsUseCase{

    constructor(
        private reviewsRepository: IReviewsRepository,
    ){}

    async execute({
        reviewId,
        approved
    }: IRequestApproveReviews): Promise<void>{
        // buscar reviews pelo id
        const approveReviewsExists = await this.reviewsRepository.findById(reviewId)

        // validar se reviews existe pelo id
        if(!approveReviewsExists){
            throw new AppError('Avaliação não encontrado', 404)
        }

        // aprovar reviews
        await this.reviewsRepository.approve(reviewId, approved)
    }
}