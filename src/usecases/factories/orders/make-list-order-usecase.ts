import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { ListOrderUsecase } from "@/usecases/orders/list/list-order-usecase";

export async function makeListOrder(): Promise<ListOrderUsecase>{
        const orderRepository = new PrismaOrderRepository()

        const listOrderUsecase = new ListOrderUsecase(
            orderRepository
        )
        return listOrderUsecase
}