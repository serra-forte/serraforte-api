import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { DeleteAllTokensUseCase } from "@/usecases/users/delete-all-tokens/refresh-token-usecase";

export async function makeDeleteAllToken(): Promise<DeleteAllTokensUseCase> {
    const usersTokensRepository = new PrismaTokensRepository();
    const deleteAllTokensUseCase = new DeleteAllTokensUseCase(
        usersTokensRepository
        )

    return deleteAllTokensUseCase
}