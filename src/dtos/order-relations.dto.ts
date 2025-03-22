import { Box, Cancellation, Freight, Item, Payment, Role, SeviceDelivery, ShoppingCart, Status, User } from "@prisma/client"

export interface IOrderRelationsDTO{
    id: string
    code: string
    total: number
    user: User
    status: Status
    withdrawStore: boolean
    items: Item[]
    payment: Payment
    cancellations: Cancellation[]
    shoppingCart: ShoppingCart
    boxes: Box[]
    delivery: {
        id: string,
        orderId: string,
        userId: string,
        deliveryDate: Date,
        shippingDate: Date,
        receiverDocument: string,
        receiverName: string,
        freights: Freight[],
        serviceDelivery: SeviceDelivery 
        address:{
            street?: string | null;
            num?: number | null;
            neighborhood?: string | null;
            city?: string | null;
            state?: string | null;
            country?: string | null;
            zipCode?: string | null;
            complement?: string | null;
            reference?: string | null;
        }
    }
    createdAt: Date | string
}