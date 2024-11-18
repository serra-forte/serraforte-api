import { IImagesRepository } from "@/repositories/interfaces/interface-images-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Image } from "@prisma/client"

interface IRequestListImages{
    userId: string
}

export class ListImageByUserUseCase {
    constructor(
        private imageRepository: IImagesRepository,
        private userRepository: IUsersRepository
        ) {}

    async execute({
        userId
    }:IRequestListImages): Promise<Image[]>{
        // buscar usuario pelo id
        const findUserExists = await this.userRepository.findById(userId)

        // validar se usuario existe pelo id
        if(!findUserExists){
            throw new AppError('Usuário não encontrado', 404)
        }

        // list all images pelo id do usuario
        const images = await this.imageRepository.listByUser(userId)

        // retornar lista de imagens
        return images
    }
}