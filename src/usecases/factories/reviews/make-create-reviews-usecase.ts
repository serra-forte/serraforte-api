import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaReviewsRepository } from "@/repositories/prisma/prisma-reviews-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateReviewsUseCase } from "@/usecases/reviews/create/create-reviews-usecase";

export async function makeCreateReviews(): Promise<CreateReviewsUseCase>{
    const reviewsRepository = new PrismaReviewsRepository()
    const usersRepository = new PrismaUsersRepository()
    const productsRepository = new PrismaProductsRepository()
    const createReviewsUseCase = new CreateReviewsUseCase(
        reviewsRepository,
        usersRepository,
        productsRepository
    )

    return createReviewsUseCase
}