import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserByAdminUseCase } from '@/usecases/admins/update-user-by-admin/update-user-by-admin-usecase'

export async function makeUpdateUserByAdmin(): Promise<UpdateUserByAdminUseCase> {
  const usersRepository = new PrismaUsersRepository()
  const updateUserByAdminUseCase = new UpdateUserByAdminUseCase(
    usersRepository
  )

  return updateUserByAdminUseCase
}
