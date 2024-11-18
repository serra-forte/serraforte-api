import { Product, User } from '@prisma/client';
export interface IReviewsRelationsDTO {
    id?: string
    user: User
    product: Product
    comment: string
    rating: number
    createdAt: Date
}