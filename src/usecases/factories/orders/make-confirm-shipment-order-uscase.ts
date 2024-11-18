import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { ConfirmShipmentOrderUseCase } from "@/usecases/orders/confirm-shipment/confirm-shipment-order-usecase";

export async function makeConfirmShipment(): Promise<ConfirmShipmentOrderUseCase>{
        const orderRepository = new PrismaOrderRepository()
        const deliveryRepository = new PrismaDeliveryRepository()
        const dateProvider = new DayjsDateProvider()

        const confirmShipmentOrderUseCase = new ConfirmShipmentOrderUseCase(
            orderRepository,
            deliveryRepository,
            dateProvider
        )
        return confirmShipmentOrderUseCase
}