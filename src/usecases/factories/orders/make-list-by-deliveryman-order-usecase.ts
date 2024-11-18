import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { ListByDeliveryManOrderUsecase } from "@/usecases/orders/list-by-deliveryman/list-by-deliveryman-order-usecase";

export async function makeListByDeliveryMan(): Promise<ListByDeliveryManOrderUsecase>{
        const orderRepository = new PrismaOrderRepository()

        const listByDeliveryManOrderUsecase = new ListByDeliveryManOrderUsecase(
            orderRepository
        )
        return listByDeliveryManOrderUsecase
}