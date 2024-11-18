import { beforeEach, describe, expect, test } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DayjsDateProvider } from '@/providers/DateProvider/implementations/provider-dayjs'
import { InMemoryTokensRepository } from '@/repositories/in-memory/in-memory-tokens-repository'
import { InMemoryMailProvider } from '@/providers/MailProvider/in-memory/in-memory-mail-provider'
import { CreateUserByAdminUseCase } from './create-user-by-admin-usecase'
import { hash } from 'bcrypt'
import { AppError } from '@/usecases/errors/app-error'

let cardRepositoryInMemory: InMemoryCardRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let usersTokensRepositoryInMemory: InMemoryTokensRepository
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let stu: CreateUserByAdminUseCase

describe('Create user by admin (unit)', () => {
  beforeEach(async () => {
    cardRepositoryInMemory = new InMemoryCardRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository(
      cardRepositoryInMemory,
    )
    usersTokensRepositoryInMemory = new InMemoryTokensRepository()
    sendMailProvider = new InMemoryMailProvider()
    dayjsDateProvider = new DayjsDateProvider()
    stu = new CreateUserByAdminUseCase(
      usersRepositoryInMemory,
      dayjsDateProvider,
      usersTokensRepositoryInMemory,
      sendMailProvider,
    )

    // criar usuario admin
    await usersRepositoryInMemory.create({
      id: 'de560a53-ca70-4826-b41a-9b8b0739a6d8',
      cpf: '12345678910',
      email: 'user-test@email.com',
      gender: 'MASCULINO',
      name: 'John Doe',
      role: 'ADMIN',
      phone: '77-77777-7777',
      password: await hash('123456', 8),
    })

    // criar usuario admin
    await usersRepositoryInMemory.create({
      id: 'ffb3d339-507d-4495-895c-8bc8118bbf4d',
      cpf: '12345678910',
      email: 'user-test5@email.com',
      gender: 'MASCULINO',
      name: 'John Doe',
      role: 'PACIENT',
      phone: '77-77777-7777',
      password: await hash('123456', 8),
    })
  })

  test('Should be able to register a new account', async () => {
    const user = await stu.execute({
      userId: 'de560a53-ca70-4826-b41a-9b8b0739a6d8',
      email: 'kaio-dev@outlook.com',
      name: 'Kaio Moreira',
      phone: '77-77777-7777',
      role: 'ADMIN',
    })
    // confirmar se email foi enviado
    const message = await sendMailProvider.findMessageSent(user.email)

    expect(user.id).toEqual(expect.any(String))
    expect(message).toEqual(
      expect.objectContaining({
        subject: 'Confirmação de email',
      }),
    )
  })

  test('Should not be able to register a new account with email already exists', async () => {
    await expect(() =>
      stu.execute({
        userId: 'de560a53-ca70-4826-b41a-9b8b0739a6d8',
        email: 'user-test@email.com',
        name: 'Kaio Moreira',
        phone: '77-77777-7777',
        role: 'ADMIN',
      }),
    ).rejects.toEqual(new AppError('Email já cadastrado', 409))
  })

  test('Should not be able to register a new account with user admin invalid', async () => {
    await expect(() =>
      stu.execute({
        userId: 'd6acae59-cefc-4926-ba86-395cc71e6517',
        email: 'user-test1@email.com',
        name: 'Kaio Moreira',
        phone: '77-77777-7777',
        role: 'ADMIN',
      }),
    ).rejects.toEqual(new AppError('Usuario não encontrado', 404))
  })
})
