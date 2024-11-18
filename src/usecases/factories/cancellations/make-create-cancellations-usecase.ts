import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CancellationUseCase } from "@/usecases/cancellations/create/create-cancellations-usecase";

export async function makeCreateCancellation(): Promise<CancellationUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()
    const usersRepository = new PrismaUsersRepository()
    const orderRepository = new PrismaOrderRepository()
    const dayjsProvider = new DayjsDateProvider()
    const etherealProvider = await EtherealProvider.createTransporter()
    const mailProvider = new MailProvider


    const cancellationUseCase = new CancellationUseCase(
        cancellationsRepository,
        orderRepository,
        usersRepository,
        dayjsProvider,
        etherealProvider,
        mailProvider
    )

    return cancellationUseCase
}