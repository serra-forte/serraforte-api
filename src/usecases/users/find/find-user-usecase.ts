import { User } from "@prisma/client";
import 'dotenv/config'
import { AppError } from "@/usecases/errors/app-error";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";

interface IRequestFindUser {
   id: string
}
interface IResponseFindUser {
    user: User
}

export class FindUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id
    }:IRequestFindUser):Promise<IResponseFindUser>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(id)

        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('Usuário não encontrado', 404)
        }

        const getSafeUser = await this.usersRepository.getUserSecurity(findUserExist.id) as User

        // retornar usuario
        return {
            user: getSafeUser
        }
    }
}