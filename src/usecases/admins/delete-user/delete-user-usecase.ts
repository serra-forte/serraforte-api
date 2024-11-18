import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import 'dotenv/config'

interface IRequestDeleteUser {
   id: string,
}

export class DeleteUserByAdminUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id,
    }:IRequestDeleteUser):Promise<void>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(id)
        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('User not found', 404)
        }

        // delete user
        await this.usersRepository.delete(findUserExist.id)
    }
}