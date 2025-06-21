import { IUserRelations } from "@/dtos/user-relations.dto";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { compare } from "bcrypt";
import 'dotenv/config'

interface IRequestDeleteUser {
   id: string,
   password: string
}

export class DeleteUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private orderRepository: IOrderRepository
    ) {}

    async execute({
        id,
        password
    }:IRequestDeleteUser):Promise<void>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(id) as unknown as IUserRelations
        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('User not found', 404)
        }

        // comparar senha
        const passwordMatch = await compare(password, findUserExist.password as string)

        if(!passwordMatch){
            throw new AppError('Password not match', 401)
        }

        const hasOpenOrder = await this.orderRepository.hasActiveOrder(findUserExist.id)

        if(hasOpenOrder){
            throw new AppError('Existem pedidos viculados ao usuário', 400)
        }

        await this.usersRepository.delete(findUserExist.id)
    }
}