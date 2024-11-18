import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FilterOrdersUseCase } from "@/usecases/orders/filter/filter-orders-usecase";

export async function makeFilterOrders(): Promise<FilterOrdersUseCase>{
        const orderRepository = new PrismaOrderRepository()

        const filterOrdersUseCase = new FilterOrdersUseCase(
            orderRepository,
        )
        return filterOrdersUseCase
}