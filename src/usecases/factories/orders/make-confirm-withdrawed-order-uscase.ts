import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs';
import { PrismaOrderRepository } from '@/repositories/prisma/prisma-orders-repository';
import { ConfirmWithdrawedStoreOrderUseCase } from '../../orders/confirm-withdraw-store/confirm-withdrawed-store-order-usecase';

export async function makeConfirmWithdrawed(): Promise<ConfirmWithdrawedStoreOrderUseCase>{
        const orderRepository = new PrismaOrderRepository()
        const dateProvider = new DayjsDateProvider()

        const confirmWithdrawedStoreOrderUseCase = new ConfirmWithdrawedStoreOrderUseCase(
            orderRepository,
            dateProvider
        )
        return confirmWithdrawedStoreOrderUseCase
}