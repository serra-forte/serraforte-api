import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { ListCancellationByStatusUseCase } from "@/usecases/cancellations/list-by-status/list-by-status-cancellations-usecase";

export async function makeListCancellationByStatus(): Promise<ListCancellationByStatusUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()

    const listCancellationByStatusUseCase = new ListCancellationByStatusUseCase(
        cancellationsRepository,
    )

    return listCancellationByStatusUseCase
}