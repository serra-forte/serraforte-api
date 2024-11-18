import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { PrismaTokensRepository } from '@/repositories/prisma/prisma-tokens-repository'
import { VerifyTokenExistsValidUseCase } from '@/usecases/tokens/verify-token-exists/verify-token-exists-usecase'

export async function makeVerifyTokenExists(): Promise<VerifyTokenExistsValidUseCase> {
  const usersTokensRepository = new PrismaTokensRepository()
  const dayjsDateProvider = new DayjsDateProvider()
  const verifyTokenExistsValidUseCase = new VerifyTokenExistsValidUseCase(
    usersTokensRepository,
    dayjsDateProvider,
  )

  return verifyTokenExistsValidUseCase
}
