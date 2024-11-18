import { beforeEach, describe, expect, test } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcrypt'
import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { InMemoryTokensRepository } from '@/repositories/in-memory/in-memory-tokens-repository'
import { RegisterUseCase } from '../register/register-usecase'
import { InMemoryMailProvider } from '@/providers/MailProvider/in-memory/in-memory-mail-provider'
import { CreateNewPasswordByOldPassword } from './change-password-usecase'
import { AppError } from '@/usecases/errors/app-error'

let usersRepositoryInMemory: InMemoryUsersRepository
let usersTokensRepositoryInMemory: InMemoryTokensRepository
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase
let cardRepositoryInMemory: InMemoryCardRepository
let stu: CreateNewPasswordByOldPassword

describe('Create new password by old password (unit)', () => {
  beforeEach(async () => {
    cardRepositoryInMemory = new InMemoryCardRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository(
      cardRepositoryInMemory,
    )
    stu = new CreateNewPasswordByOldPassword(usersRepositoryInMemory)

    await usersRepositoryInMemory.create({
      id: '9f7702b8-a7d9-4532-8ef6-ecffcb37e178',
      cpf: '12345678910',
      gender: 'MASCULINO',
      email: 'user-test@email.com',
      name: 'John Doe',
      phone: '77-77777-7777',
      password: await hash('123456', 8),
    })
  })

  test('Should be able to change passwod account with old password', async () => {
    const createNewPassword = await stu.execute({
      userId: '9f7702b8-a7d9-4532-8ef6-ecffcb37e178',
      oldPassword: '123456',
      newPassword: '159753',
    })

    expect(createNewPassword).toBe('Senha alterada com sucesso')
  })

  test('Should not be able to change passwod account with old password incorret', async () => {
    await expect(() =>
      stu.execute({
        userId: '9f7702b8-a7d9-4532-8ef6-ecffcb37e178',
        oldPassword: '12345',
        newPassword: '159753',
      }),
    ).rejects.toEqual(new AppError('Senha antiga não incorreta', 401))
  })

  test('Should not be able to change passwod account by old password with userId invalid', async () => {
    await expect(() =>
      stu.execute({
        userId: '66db1c18-a79c-4b0c-bbde-1eeef1b5e94a',
        oldPassword: '123456',
        newPassword: '159753',
      }),
    ).rejects.toEqual(new AppError('Usuário não existe', 404))
  })
})
