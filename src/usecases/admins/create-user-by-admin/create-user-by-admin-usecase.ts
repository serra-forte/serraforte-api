import { env } from '@/env'
import { Role, StoreHours, User } from '@prisma/client'
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from 'crypto'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider'
import { AppError } from '@/usecases/errors/app-error'
import { generatoRandomKey } from '@/utils/generator-random-key'
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository'
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository'
import { IAsaasProvider, IResponseCreateSubAccountToSplitPayment } from '@/providers/PaymentProvider/interface-asaas-payment'
import { S } from 'vitest/dist/types-198fd1d9'

export type IPaymentType = 'FIXO' | 'PERCENTAGE'

interface IRequestCreateUser {
  email: string
  name: string
  mobilePhone: string; // Fone celular
  role: Role;
  paymentFee?: number | null; // Taxa de pagamento

  cpfCnpj?: string | null; // CPF ou CNPJ do proprietário da subconta
  incomeValue?: number | null; // Faturamento/Renda mensal
  address?: string | null; // Logradouro
  addressNumber?: string | null; // Número do endereço
  province?: string | null; // Bairro
  postalCode?: string | null; // CEP do endereço
  birthDate?: Date | null
  companyType?: string | null // tipo da subconta
  city?: string | null
  paymentType: IPaymentType
  hasReceivePyaments: boolean
  hasDeliveryMan: boolean

  storeHours: {
    dayOfWeek: string | null
    openTime: string | null
    closeTime: string | null
  }[] | undefined
}


export class CreateUserByAdminUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private dayjsDateProvider: IDateProvider,
    private usersTokensRepository: ITokensRepository,
    private sendMailProvider: IMailProvider,
    private asaasProvider: IAsaasProvider
  ) {}

  async execute({
    email,
    name,
    mobilePhone,
    cpfCnpj,
    incomeValue,
    address,
    addressNumber,
    province,
    postalCode,
    birthDate,
    role,
    paymentFee,
    hasReceivePyaments,
    companyType,
    paymentType,
    hasDeliveryMan,
    storeHours,
    city
  }: IRequestCreateUser): Promise<User> {
    const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (findEmailAlreadyExists) {
      throw new AppError('Email já cadastrado', 409)
    }
    
    // verificar se telefone ja existe
    if(mobilePhone){
      const findPhoneAlreadyExists = await this.usersRepository.findByPhone(mobilePhone)
      if(findPhoneAlreadyExists){
        throw new AppError('Telefone já cadastrado', 409)
      }
    }

    let createSubAccount: IResponseCreateSubAccountToSplitPayment | undefined = {} as IResponseCreateSubAccountToSplitPayment | undefined

    const randomPass = generatoRandomKey(8)

    try {
      if(hasReceivePyaments){
        if(
          !cpfCnpj || 
          !incomeValue || 
          !address || 
          !addressNumber || 
          !province || 
          !postalCode ||
          !mobilePhone ||
          !email ||
          !name
        ){
            throw new AppError('Preencha todos os campos para criar uma subconta na Asaas', 400)
          }
      
           // criar subconta no Asaas
          createSubAccount = await this.asaasProvider.createSubAccountToSplitPayment({
            address,
            addressNumber,
            birthDate: birthDate as Date ?? null,
            mobilePhone,
            province,
            companyType: companyType as string ?? null,
            postalCode,
            cpfCnpj,
            incomeValue,
            name,
            email,
            loginEmail: email,
            webhooks:[
              {
                name: 'Webhook para cobranças', // Nome do webhook
                email: 'suporte@hermac.com.br', // email para receber notificaçoes do webhook
                url: 'https://api-tools-delivery.up.railway.app/api/orders/webhook-payment', // url do webhook,
                sendType: 'SEQUENTIALLY', //'SEQUENTIALLY' | 'NON_SEQUENTIALLY'; // Tipo de envio (sequencial ou não)
                enabled: true,
                events: ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS', 'PAYMENT_OVERDUE'],
              }
            ]
          })
  
        if(!createSubAccount){
          throw new AppError('Erro ao criar subconta no Asaas. Verifique os campos de cpfCpj, endereço, telefone, data de nascimento ou faturamento', 500)
        }
      }

        const criptingPassword = await hash(`${randomPass}`, 8)

        const user = await this.usersRepository.create({
          asaasWalletId: createSubAccount && createSubAccount.walletId ? createSubAccount.walletId : null,
          email,
          name,
          password: criptingPassword,
          cpf: cpfCnpj,
          phone: mobilePhone,
          role,
          dateBirth: birthDate,
          incomeValue,
          paymentFee: Number(paymentFee) ?? 0,
          paymentType,
          hasDeliveryMan,
          shoppingCart:{
            create:{
                expireDate: new Date(),
                total: 0
            }
          },
          address:{
            create:{
              num: addressNumber as string,
              neighborhood: province,
              street: address as string,
              zipCode: postalCode,
              city: city as string,
              state: province as string,
              country: '',
            }
          },
          storeHours:{
            create: storeHours as StoreHours[]
          }
        })

        // pegar template de verificaçao de email
        const pathTemplate =
          env.NODE_ENV === 'development'
            ? './views/emails/verify-email-with-password.hbs'
            : './build/views/emails/verify-email-with-password.hbs'

        // gerar token valido por 3h
        const token = randomUUID()
        // gerar data em horas
        const expireDateHours = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
        await this.usersTokensRepository.create({
          userId: user.id,
          expireDate: expireDateHours,
          token,
        })
        // formatar link com token
        const link =
            env.NODE_ENV === 'development'
            ? `${env.APP_URL_FRONTEND_DEVELOPMENT}/verification/${token}/${email}`
            : `${env.APP_URL_FRONTEND_PRODUCTION}/verification/${token}/${email}`

        // enviar verificação de email
        await this.sendMailProvider.sendEmail(
          email,
          name,
          'Confirmação de email',
          link,
          pathTemplate,
          {
            password: randomPass,
          }
          
        )
      return user
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
