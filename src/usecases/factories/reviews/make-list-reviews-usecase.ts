import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { ListReviewsUseCase } from "@/usecases/reviews/list/list-reviews-usecase";

export async function makeListReviews(): Promise<ListReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const listReviewsUseCase = new ListReviewsUseCase(
        reviewsRepository,
    )

    return listReviewsUseCase
}