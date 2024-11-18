import { env } from "@/env"
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface"
import { IImagesRepository } from "@/repositories/interfaces/interface-images-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Image } from "@prisma/client"

interface IRequestUploadImage{
    userId: string
    imageInfo: {
        name: string
        hashName: string
    }[]
}

export class UploadImageUseCase {
    constructor(
        private storageProvider: IStorageProvider,
        private userRepository: IUsersRepository,
        private imageRepository: IImagesRepository,
        ) {}

    async execute({
        userId,
        imageInfo
    }: IRequestUploadImage): Promise<Image[]>{
        // buscar usuario pelo id
        const findUserExists = await this.userRepository.findById(userId)

        // verificar se existe usuario
        if(!findUserExists){
            throw new AppError('Usuário não encontrado', 404)
        }

        // criar constante com o caminho da pasta de imagens
        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}` : `${env.FOLDER_TMP_DEVELOPMENT}`

        // lista de imagens
        let arrayImagesUploaded: Image[] = []
        // criar for para fazer upload de mais de uma imagem no firebase storage
        // e salvar cada url na tabela de imagens
        for(let image of imageInfo){
            // fazer upload do exame dentro firebase através do nome do arquivo
            let imageUrl = await this.storageProvider.uploadFile(image.hashName, pathFolder, 'products') as string

            // criar imagem no banco de dados
            const createImage = await this.imageRepository.upload({
                userId,
                name: image.name,
                hashName: image.hashName,
                url: imageUrl
            })

            // adicionar imagem no array de imagens
            arrayImagesUploaded.push(createImage)
        }

        // retornar array de imagens
        return arrayImagesUploaded
    }
}