import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ChooseDeliveryManOrderUseCase } from "@/usecases/orders/choose-deliveryman/choose-deliveryman-order-usecase";

export async function makeChooseDeliveryMan(): Promise<ChooseDeliveryManOrderUseCase>{
        const orderRepository = new PrismaOrderRepository()
        const deliveryRepository = new PrismaDeliveryRepository()
        const userRepository = new PrismaUsersRepository()

        const chooseDeliveryManOrderUseCase = new ChooseDeliveryManOrderUseCase(
            orderRepository,
            deliveryRepository,
            userRepository
        )
        return chooseDeliveryManOrderUseCase
}