import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository'
import { User } from '@prisma/client'
import 'dotenv/config'

export class ListUsersAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    const users =
      await this.usersRepository.list()

    // retornar usuarios
    return users
  }
}
