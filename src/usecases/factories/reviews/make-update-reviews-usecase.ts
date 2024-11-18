import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateReviewsUseCase } from "@/usecases/reviews/update/update-reviews-usecase";

export async function makeUpdateReviews(): Promise<UpdateReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const usersRepository = new PrismaUsersRepository()
    const productsRepository = new PrismaProductsRepository()
    const updateReviewsUseCase = new UpdateReviewsUseCase(
        reviewsRepository,
        usersRepository,
        productsRepository
    )

    return updateReviewsUseCase
}