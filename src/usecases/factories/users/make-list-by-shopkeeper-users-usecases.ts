import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ListUserByShopkeeperUseCase } from '@/usecases/users/list-by-shopkeeper/list-by-shopkeeper-users-usecase'

export async function makeListByShopkeeper(): Promise<ListUserByShopkeeperUseCase> {
  const usersRepository = new PrismaUsersRepository()
  const listUserByShopkeeperUseCase =
    new ListUserByShopkeeperUseCase(usersRepository)

  return listUserByShopkeeperUseCase
}
