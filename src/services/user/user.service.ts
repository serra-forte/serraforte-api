import { UserServiceBase } from "./user.base";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found.error";
import { USER_NOT_FOUND } from "@/usecases/errors/error-codes";
import { IUserRelations } from "@/dtos/user-relations.dto";

export class UserService implements UserServiceBase{
    constructor(
        private userRepository: IUsersRepository,
    ) {}
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

    async findById(id: string): Promise<IUserRelations> {
        try{
            const result = await this.userRepository.findById(id)

            if(!result){
                throw new ResourceNotFoundError(USER_NOT_FOUND)
            }

            return result as unknown as IUserRelations
        }catch(error){
            throw error
        }
    }
}