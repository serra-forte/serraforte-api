import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"

export interface IRequestUploadAvatar{
    userId: string
    avatarUrl: string
}

export class UploadAvatarUserUseCase {
    constructor(
        private usersRepository: IUsersRepository
    ) {}

    async execute({ userId, avatarUrl }: IRequestUploadAvatar) {
        // buscar usuario pelo id
        const findUserExist = await this.usersRepository.findById(userId)

        // validar se usuario existe
        if(!findUserExist) {
            throw new AppError("Usuário não encontrado", 404)
        } 

        await this.usersRepository.uploadAvatarUrl(userId, avatarUrl)
    }
}