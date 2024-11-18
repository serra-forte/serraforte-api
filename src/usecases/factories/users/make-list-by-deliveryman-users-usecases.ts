import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ListByDeliveryManUsecase } from '@/usecases/users/list-by-deliveryman/list-by-deliverymanorder-usecase'

export async function makeListByDeliveryMan(): Promise<ListByDeliveryManUsecase> {
  const usersRepository = new PrismaUsersRepository()
  const listByDeliveryManUsecase =
    new ListByDeliveryManUsecase(usersRepository)

  return listByDeliveryManUsecase
}
