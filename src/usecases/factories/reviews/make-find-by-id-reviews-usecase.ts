import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { FindByIdReviewsUseCase } from "@/usecases/reviews/find-by-id/find-by-id-reviews-usecase";

export async function makeFindByIdReviews(): Promise<FindByIdReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const findByIdReviewsUseCase = new FindByIdReviewsUseCase(
        reviewsRepository,
    )

    return findByIdReviewsUseCase
}