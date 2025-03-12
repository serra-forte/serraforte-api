import { IResponseListUsers, IUsersRepository } from '@/repositories/interfaces/interface-users-repository'
import 'dotenv/config'

export interface IRequestListUsers{
  page?: number | null
  take?: number | null
}
export class ListUserByShopkeeperUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    page,
    take
  }: IRequestListUsers): Promise<IResponseListUsers> {
    const users =
      await this.usersRepository.listByShopkeeper(page, take)

    // retornar usuarios
    return users
  }
}
