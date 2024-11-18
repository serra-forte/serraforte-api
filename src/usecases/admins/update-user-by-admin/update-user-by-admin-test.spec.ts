import { beforeEach, describe, expect, test } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcrypt'
import { AppError } from '@/usecases/errors/app-error'
import { UpdateUserByAdminUseCase } from './update-user-by-admin-usecase'

let cardRepositoryInMemory: InMemoryCardRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let stu: UpdateUserByAdminUseCase

describe('Update user by admin (unit)', () => {
  beforeEach(async () => {
    cardRepositoryInMemory = new InMemoryCardRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository(
      cardRepositoryInMemory,
    )
    stu = new UpdateUserByAdminUseCase(usersRepositoryInMemory)

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

  test('Should be able to update user', async () => {
    const user = await stu.execute({
      userId: 'ffb3d339-507d-4495-895c-8bc8118bbf4d',
      idAdmin: 'de560a53-ca70-4826-b41a-9b8b0739a6d8',
      email: 'linda-dev@outlook.com',
      name: 'Linda Moreira',
      role: 'DOCTOR',
      phone: '77-77777-7788',
      cpf: '12345678910',
      gender: 'FEMININO',
      password: '1234567',
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: 'ffb3d339-507d-4495-895c-8bc8118bbf4d',
        email: 'linda-dev@outlook.com',
        name: 'Linda Moreira',
        phone: '77-77777-7788',
        role: 'DOCTOR',
        cpf: '12345678910',
        gender: 'FEMININO',
      }),
    )
  })

  test('Should not be able to update with user admin invalid', async () => {
    await expect(() =>
      stu.execute({
        userId: 'ffb3d339-507d-4495-895c-8bc8118bbf4d',
        idAdmin: '2517ba10-f4f5-448f-9d60-14ef4a37878a',
        email: 'user-test1@email.com',
        name: 'Kaio Moreira',
        phone: '77-77777-7777',
        role: 'ADMIN',
        gender: 'FEMININO',
        password: '1234567',
        cpf: '12345678910',
      }),
    ).rejects.toEqual(new AppError('Usuario não encontrado', 404))
  })
})
