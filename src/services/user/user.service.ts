import { UserServiceBase } from "./user.base";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found.error";
import { USER_NOT_FOUND } from "@/usecases/errors/error-codes";
import { IUserRelations } from "@/dtos/user-relations.dto";
import { AppError } from "@/usecases/errors/app-error";
import { IOrderUserInfo } from "@/interfaces/order-user-info";

export class UserService implements UserServiceBase{
    constructor(
        private userRepository: IUsersRepository,
    ) {}
    async updateUser(data: IOrderUserInfo): Promise<IUserRelations> {
        try{
            const result = await this.userRepository.update({
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                cpf: data.cpf                
            })

            if(!result){
                throw new AppError('Erro ao atualizar o usuário', 500)
            }

            return result
        } catch (error) {
            throw error
        }
    }
    async updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<boolean> {
        try{
            const result = await this.userRepository.updateAsaasCostumerId(id, asaasCustomerId)

            if(!result){
                throw new ResourceNotFoundError(USER_NOT_FOUND)
            }

            return true
        } catch (error) {
            throw error
        }
    }
    async findById(user: IOrderUserInfo): Promise<IUserRelations> {
        try{
            const result = await this.userRepository.findById(user.id)

            if(!result){
                throw new ResourceNotFoundError(USER_NOT_FOUND)
            }

            const updateUser = await this.updateUser(user)

            return updateUser
        }catch(error){
            throw error
        }
    }
}