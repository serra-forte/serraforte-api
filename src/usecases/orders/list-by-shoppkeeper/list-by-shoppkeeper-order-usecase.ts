import { IOrderRepository, IResponseListOrders } from "@/repositories/interfaces/interface-order-repository"
import { Order } from "@prisma/client"

interface IRequestListOrderByShoppKeeper {
    userId: string,
    page?: number | null
}

export class ListByShoppKeeperOrderUsecase {
    constructor(
        private orderRepository: IOrderRepository
    ){}

    async execute({
        userId,
        page
    }: IRequestListOrderByShoppKeeper): Promise<IResponseListOrders> {
        const orders = await this.orderRepository.listByShoppKeeper(userId, page)

        return orders
    }
}