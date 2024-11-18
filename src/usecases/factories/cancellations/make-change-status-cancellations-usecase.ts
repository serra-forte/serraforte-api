import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment";
import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ChangeStatusCancellationUseCase } from "@/usecases/cancellations/change-status/change-status-cancellations-usecase";

export async function makeChangeStatusCancellation(): Promise<ChangeStatusCancellationUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()
    const paymentsRepository = new PrismaPaymentRepository()
    const productRepository = new PrismaProductsRepository()
    const asaasProvider = new AsaasProvider()

    const changestatusCancellationUseCase = new ChangeStatusCancellationUseCase(
        cancellationsRepository,
        paymentsRepository,
        productRepository,
        asaasProvider
    )

    return changestatusCancellationUseCase
}