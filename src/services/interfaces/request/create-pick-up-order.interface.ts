import { CartItem, PaymentMethod } from "@prisma/client";

export interface ICreatePickUpOrderRequest {
    userId: string
    shoppingCartId: string
    items: CartItem[]
    total: number
    paymentMethod: PaymentMethod
    discount: number
}