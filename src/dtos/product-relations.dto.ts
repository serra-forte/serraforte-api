import { Box, CartItem, Category, Review, User } from '@prisma/client';
export interface IProductRelationsDTO {
    id: string
    erpProductId: number;
    code: string,
    quantity: number
    price: number
    name: string
    mainImage: string
    description: string
    active: boolean
    createdAt: Date
    user: User
    sales: number
    category: Category
    averageRating: number
    ratingDistribution?: string
    reviewCount?: number
    cartItem: CartItem[]
    reviews: Review[]
    weight: number
    width: number
    height: number
    length: number
    boxes: Box[]
}