import { IFilterOrders, IOrderRepository } from "@/repositories/interfaces/interface-order-repository";

export class FilterOrdersUseCase {
    constructor(
        private ordersRepository: IOrderRepository
    ) {}

    async execute(filters: IFilterOrders) {
        const orders = await this.ordersRepository.filterOrders(filters)
        return orders
    }
}