import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { ApproveReviewsUseCase } from "@/usecases/reviews/approve/approve-reviews-usecase";

export async function makeApproveReviews(): Promise<ApproveReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const approveReviewsUseCase = new ApproveReviewsUseCase(
        reviewsRepository,
    )

    return approveReviewsUseCase
}