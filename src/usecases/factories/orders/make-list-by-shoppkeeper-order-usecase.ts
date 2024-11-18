import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { ListByShoppKeeperOrderUsecase } from "@/usecases/orders/list-by-shoppkeeper/list-by-shoppkeeper-order-usecase";

export async function makeListByShoppkeeper(): Promise<ListByShoppKeeperOrderUsecase>{
        const orderRepository = new PrismaOrderRepository()

        const listByShoppKeeperOrderUsecase = new ListByShoppKeeperOrderUsecase(
            orderRepository
        )
        return listByShoppKeeperOrderUsecase
}