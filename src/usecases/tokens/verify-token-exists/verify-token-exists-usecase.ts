import 'dotenv/config'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository'

interface IRequestVerifyToken {
  token: string
}

export class VerifyTokenExistsValidUseCase {
  constructor(
    private usersTokensRepository: ITokensRepository,
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute({ token }: IRequestVerifyToken): Promise<boolean> {
    // buscar token no banco
    const findToken = await this.usersTokensRepository.findByToken(token)

    // verifica se token foi encontrado
    if (!findToken) {
      return false
    }

    if (
      this.dayjsDateProvider.compareIfBefore(
        findToken.expireDate,
        this.dayjsDateProvider.dateNow(),
      )
    ) {
      // deletar token do banco
      await this.usersTokensRepository.delete(findToken.id)
      return false
    }

    return true
  }
}
