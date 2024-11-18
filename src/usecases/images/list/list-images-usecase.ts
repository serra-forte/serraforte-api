import { IImagesRepository } from "@/repositories/interfaces/interface-images-repository"
import { Image } from "@prisma/client"

export class ListImageUseCase {
    constructor(
        private imageRepository: IImagesRepository,
        ) {}

    async execute(): Promise<Image[]>{
        // list all images
        const images = await this.imageRepository.list()

        return images
    }
}