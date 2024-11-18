import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { MailProvider } from '@/providers/MailProvider/implementations/provider-sendgrid'
import { PrismaTokensRepository } from '@/repositories/prisma/prisma-tokens-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { SendVerificationEmailUserUseCase } from '@/usecases/users/send-verification-email/send-verification-email-users-usecase'

export async function makeSendVerificationEmail(): Promise<SendVerificationEmailUserUseCase> {
  const usersRepository = new PrismaUsersRepository()
  const sendMailProvider = new MailProvider()
  const usersTokensRepository = new PrismaTokensRepository()
  const dayjsDateProvider = new DayjsDateProvider()
  const sendVerificationEmailUserUseCase = new SendVerificationEmailUserUseCase(
    usersRepository,
    sendMailProvider,
    usersTokensRepository,
    dayjsDateProvider,
  )

  return sendVerificationEmailUserUseCase
}
