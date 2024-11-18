import { IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository";

export interface IRequestCountByCreatedReviews {
    userId?: string | null
    role?: string | null
}
export class CountByCreatedReviewsUseCase {
    constructor(
        private reviewsRepository: IReviewsRepository
    ) {}

    async execute({
        userId,
        role
    }: IRequestCountByCreatedReviews) {
        if(role === 'ADMIN' || role === 'SUPER') {
            return await this.reviewsRepository.countByCreated()
        }else{
            return await this.reviewsRepository.countByCreated(userId)
        }
    }
}