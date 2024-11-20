import { Product, ShoppingCart, User } from "@prisma/client"

export interface ICartItemRelationsDTO {
    id: string
    product: Product
    shopping: ShoppingCart
    user: User
    quantity: number
    price: number
    height: number,
    weight: number,
    width: number,
    length: number,
}