import { Image, Prisma } from "@prisma/client";
import { IImagesRepository } from "../interface-images-repository";
import { randomUUID } from "crypto";

export class InMemoryImagesRepository implements IImagesRepository{
    private images: Image[] = []

    constructor(){}
    async findByHashName(name: string){
        const image = this.images.find(image => image.hashName === name)

        if(!image){
            return null
        }

        return image
    }

    async upload({
        id,
        userId,
        name,
        url,
        hashName
    }: Prisma.ImageUncheckedCreateInput){
        const image = {
            id: id ? id : randomUUID(),
            userId,
            name,
            url,
            hashName: hashName ? hashName : null
        }
        this.images.push(image)

        return image
    }

    async list(){
        return this.images
    }

    async listByUser(id: string){
        const images = this.images.filter(image => image.userId === id)

        return images
    }
    
    async findById(id: string){
        const image = this.images.find(image => image.id ===id)

        if(!image){
            return null
        }

        return image
    }

    async deleteById(id: string) {
        const imageIndex = this.images.findIndex(image => image.id === id)

        this.images.splice(imageIndex, 1)
    }
}