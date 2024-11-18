import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { FindCancellationUseCase } from "@/usecases/cancellations/find-by-id/find-by-id-cancellations-usecase";

export async function makeFindCancellation(): Promise<FindCancellationUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()

    const findCancellationUseCase = new FindCancellationUseCase(
        cancellationsRepository,
    )

    return findCancellationUseCase
}