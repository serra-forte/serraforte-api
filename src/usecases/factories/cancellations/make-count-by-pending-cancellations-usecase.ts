import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { CountByPendingUseCase } from "@/usecases/cancellations/count-by-pending/count-by-pending-usecase";

export async function makeCountByPending(): Promise<CountByPendingUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()

    const countByPendingUseCase = new CountByPendingUseCase(
        cancellationsRepository,
    )

    return countByPendingUseCase
}