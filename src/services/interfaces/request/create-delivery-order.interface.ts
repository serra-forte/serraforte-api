import { IAddress } from "@/interfaces/address.interface";
import { IFreight } from "@/interfaces/freight.interface";
import { CartItem, PaymentMethod } from "@prisma/client";

export interface ICreateDeliveryOrderRequest {
    userId: string
    shoppingCartId: string
    freight: IFreight
    address: IAddress
    items: CartItem[]
    total: number
    paymentMethod: PaymentMethod
    discount: number
}