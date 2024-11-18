import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { ListCancellationUseCase } from "@/usecases/cancellations/list/list-cancellations-usecase";

export async function makeListCancellation(): Promise<ListCancellationUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()

    const listCancellationUseCase = new ListCancellationUseCase(
        cancellationsRepository,
    )

    return listCancellationUseCase
}