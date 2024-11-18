import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ListUsersAdminUseCase } from '@/usecases/admins/list-users/list-users-admin-usecase'

export async function makeListUsers(): Promise<ListUsersAdminUseCase> {
  const usersRepository = new PrismaUsersRepository()
  const listUsersAdminUseCase =
    new ListUsersAdminUseCase(usersRepository)

  return listUsersAdminUseCase
}
