import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FindOrderUseCase } from "@/usecases/orders/find-by-id/find-by-id-orders-usecase";

export async function makeFindOrderById(): Promise<FindOrderUseCase>{
        const orderRepository = new PrismaOrderRepository()

        const findOrderUseCase = new FindOrderUseCase(
            orderRepository
        )
        return findOrderUseCase
}