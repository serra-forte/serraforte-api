import { MailProvider } from '@/providers/MailProvider/implementations/provider-sendgrid'
import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaTokensRepository } from '@/repositories/prisma/prisma-tokens-repository'
import { CreateUserByAdminUseCase } from '@/usecases/admins/create-user-by-admin/create-user-by-admin-usecase'
import { AsaasProvider } from '@/providers/PaymentProvider/implementations/provider-asaas-payment'

export async function makeCreateUserByAdmin(): Promise<CreateUserByAdminUseCase> {
  const usersRepository = new PrismaUsersRepository()
  const usersTokensRepository = new PrismaTokensRepository()
  const sendMailProvider = new MailProvider()
  const dayjsDateProvider = new DayjsDateProvider()
  const asaasProvider = new AsaasProvider()
  const createUserByAdminUseCase = new CreateUserByAdminUseCase(
    usersRepository,
    dayjsDateProvider,
    usersTokensRepository,
    sendMailProvider,
    asaasProvider
  )

  return createUserByAdminUseCase
}
