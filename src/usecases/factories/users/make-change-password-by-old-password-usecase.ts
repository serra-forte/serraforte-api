import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateNewPasswordByOldPassword } from '@/usecases/users/create-new-password-with-old-password/change-password-usecase'

export async function makeCreateNewPasswordByOldPassword(): Promise<CreateNewPasswordByOldPassword> {
  const usersRepository = new PrismaUsersRepository()
  const createNewPasswordByOldPassword = new CreateNewPasswordByOldPassword(
    usersRepository,
  )

  return createNewPasswordByOldPassword
}
