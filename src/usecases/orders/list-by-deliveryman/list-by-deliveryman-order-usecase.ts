import { IOrderRepository, IResponseListOrders } from "@/repositories/interfaces/interface-order-repository"
import { Order } from "@prisma/client"

interface IRequestListOrderByDeliveryman {
    userId: string
    page?: number | null
}

export class ListByDeliveryManOrderUsecase {
    constructor(
        private orderRepository: IOrderRepository
    ){}

    async execute({
        userId,
        page
    }: IRequestListOrderByDeliveryman): Promise<IResponseListOrders> {
        const orders = await this.orderRepository.listByDeliveryMan(userId, page)

        return orders
    }
}