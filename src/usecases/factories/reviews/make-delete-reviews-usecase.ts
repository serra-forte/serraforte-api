import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteReviewsUseCase } from "@/usecases/reviews/delete/delete-reviews-usecase";

export async function makeDeleteReviews(): Promise<DeleteReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const usersRepository = new PrismaUsersRepository()
    const productsRepository = new PrismaProductsRepository()
    const deleteReviewsUseCase = new DeleteReviewsUseCase(
        reviewsRepository,
        usersRepository,
        productsRepository
    )

    return deleteReviewsUseCase
}