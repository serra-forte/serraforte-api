import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { ConfirmDeliveryOrderUseCase } from "@/usecases/orders/confirm-delivery/confirm-delivery-order-usecase";

export async function makeConfirmDelivery(): Promise<ConfirmDeliveryOrderUseCase>{
        const orderRepository = new PrismaOrderRepository()
        const deliveryRepository = new PrismaDeliveryRepository()
        const dateProvider = new DayjsDateProvider()

        const confirmDeliveryOrderUseCase = new ConfirmDeliveryOrderUseCase(
            orderRepository,
            deliveryRepository,
            dateProvider
        )
        return confirmDeliveryOrderUseCase
}