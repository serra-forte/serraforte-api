import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ListOrderByUserUsecase } from "@/usecases/orders/list-by-user/list-by-user-order-usecase";

export async function makeListOrderByUser(): Promise<ListOrderByUserUsecase>{
        const orderRepository = new PrismaOrderRepository()
        const userRepository = new PrismaUsersRepository()

        const listOrderByUserUsecase = new ListOrderByUserUsecase(
            orderRepository,
            userRepository
        )
        return listOrderByUserUsecase
}