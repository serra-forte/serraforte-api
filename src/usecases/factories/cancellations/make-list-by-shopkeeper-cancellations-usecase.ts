import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ListCancellationsByShopkeeperUseCase } from "@/usecases/cancellations/list-by-shopkeeper/list-by-shopkeeper-cancellations-usecase";

export async function makeListCancellationByShopkeeper(): Promise<ListCancellationsByShopkeeperUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()
    const usersRepository = new PrismaUsersRepository()

    const listCancellationsByShopkeeperUseCase = new ListCancellationsByShopkeeperUseCase(
        cancellationsRepository,
        usersRepository
    )

    return listCancellationsByShopkeeperUseCase
}