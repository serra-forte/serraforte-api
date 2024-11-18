import { IOrderRepository, IResponseListOrders } from "@/repositories/interfaces/interface-order-repository";
import { Order } from "@prisma/client";

export interface IListOrderUseCase {
    page?: number | null
}

export class ListOrderUsecase {
    constructor(
        private orderRepository: IOrderRepository
    ){}

    async execute({
        page
    }: IListOrderUseCase): Promise<IResponseListOrders> {
        const orders = await this.orderRepository.list(page)

        return orders
    }
}