import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteUserUseCase } from "@/usecases/users/delete/delete-user-usecase";

export async function makeDeleteUser(): Promise<DeleteUserUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const orderRepository = new PrismaOrderRepository()

    const deleteUserUseCase = new DeleteUserUseCase(usersRepository, orderRepository)

    return deleteUserUseCase
}