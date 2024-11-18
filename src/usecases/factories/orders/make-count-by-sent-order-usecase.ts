import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { CountBySentUseCase } from "@/usecases/orders/count-by-sent/count-by-sent-orders-usecase";

export async function makeCountBySent(): Promise<CountBySentUseCase>{
        const orderRepository = new PrismaOrderRepository()

        const countBySentUseCase = new CountBySentUseCase(
            orderRepository
        )
        return countBySentUseCase
}