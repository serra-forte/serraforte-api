import { User } from "@prisma/client"

export interface IShoppingCartRelationsDTO {
    id: string
    total: number
    user: User
    cartItem: {
        id: string
        productId: string
        userId: string
        name: string
        price: number
        mainImage: string
        height: number,
        width: number,
        length: number,
        weight: number,
        quantity: number,
    }[]
    expiredAt: Date
}