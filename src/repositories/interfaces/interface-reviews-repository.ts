import { IReviewsRelationsDTO } from './../../dtos/reviews-relations.dto';
import { Prisma, Review } from '@prisma/client';
export interface IResponseListReviews {
    reviews: IReviewsRelationsDTO[]
    totalPages: number
}
export interface IReviewsRepository {
    create(data: Prisma.ReviewUncheckedCreateInput):Promise<Review>
    delete(id: string):Promise<void>
    findById(id: string):Promise<Review | null>
    list(page?: number | null, userId?: string | null):Promise<IResponseListReviews>
    countByCreated(userId?: string | null):Promise<number>
    approve(reviewId: string, approved: boolean):Promise<void>
    update(data: Prisma.ReviewUncheckedUpdateInput):Promise<Review>
}