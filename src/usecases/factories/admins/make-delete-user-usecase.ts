import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteUserByAdminUseCase } from "@/usecases/admins/delete-user/delete-user-usecase";

export async function makeDeleteUserByAdmin(): Promise<DeleteUserByAdminUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const deleteUserUseCase = new DeleteUserByAdminUseCase(usersRepository)

    return deleteUserUseCase
}