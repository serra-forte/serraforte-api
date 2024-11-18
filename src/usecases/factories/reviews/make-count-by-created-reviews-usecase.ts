import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { CountByCreatedReviewsUseCase } from "@/usecases/reviews/count-by-created/count-by-created-reviews-usecase";

export async function makeCountByCreated(): Promise<CountByCreatedReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const countByCreatedReviewsUseCase = new CountByCreatedReviewsUseCase(
        reviewsRepository,
    )

    return countByCreatedReviewsUseCase
}