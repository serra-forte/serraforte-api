import { Box, Cancellation, Delivery, Item, Payment, Role, ShoppingCart, Status, User } from "@prisma/client"

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
        id: true,
        orderId: string,
        userId: string,
        serviceId: string,
        serviceName: string,
        companyName: string,
        freightId: string,
        freightName: string,
        price: number,
        deliveryDate: Date,
        shippingDate: Date,
        receiverDocument: string,
        receiverName: string,
        deliveryMan: {
            select:{
                id: string,
                name: string,
                email: string,
                role: Role
            }
        },
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