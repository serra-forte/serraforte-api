import { env } from '@/env'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider'
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository'
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository'
import { AppError } from '@/usecases/errors/app-error'
import { randomUUID } from 'crypto'
import 'dotenv/config'

interface IVerificationEmailUser {
  email: string
}

export class SendVerificationEmailUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private sendMailProvider: IMailProvider,
    private usersTokensRepository: ITokensRepository,
    private dayjsDateProvider: IDateProvider,
  ) {}

  async execute({ email }: IVerificationEmailUser): Promise<void> {
    // encontrar usuario pelo id
    const findUserExist = await this.usersRepository.findByEmail(email)

    // validar se usuario existe
    if (!findUserExist) {
      throw new AppError('Usuário não encontrado', 404)
    }

    if(findUserExist.softDelete){
      throw new AppError('Usuário não encontrado', 404)
  }

    if (findUserExist.emailActive) {
      throw new AppError('Email já verificado', 400)
    }

    // gerar token valido por 3h
    const token = randomUUID()

    const expireDateHours = this.dayjsDateProvider.addHours(3)

    // salvar token no banco
    await this.usersTokensRepository.create({
      userId: findUserExist.id,
      token,
      expireDate: expireDateHours,
    })

    // enviar email de verificação
    // formatar link com token
    const link =
      env.NODE_ENV === 'development'
        ? `${env.APP_URL_FRONTEND_DEVELOPMENT}/verification/${token}/${email}`
        : `${env.APP_URL_FRONTEND_DEVELOPMENT}/verification/${token}/${email}`

    // pegar template de verificaçao de email
    const pathTemplate =
      env.NODE_ENV === 'development'
        ? './views/emails/verify-email.hbs'
        : './build/views/emails/verify-email.hbs'

    // enviar verificação de email
    await this.sendMailProvider.sendEmail(
      email,
      findUserExist.name,
      'Confirmação de email',
      link,
      pathTemplate,
      null,
    )
  }
}
