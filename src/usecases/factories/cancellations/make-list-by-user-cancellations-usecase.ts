import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ListCancellationsByUserUseCase } from "@/usecases/cancellations/list-by-user/list-by-user-cancellations-usecase";

export async function makeListCancellationByUser(): Promise<ListCancellationsByUserUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()
    const usersRepository = new PrismaUsersRepository()

    const listCancellationsByUserUseCase = new ListCancellationsByUserUseCase(
        cancellationsRepository,
        usersRepository
    )

    return listCancellationsByUserUseCase
}