import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IImagesRepository } from "../interfaces/interface-images-repository";

export class PrismaImageRepository implements IImagesRepository{
    async findByHashName(name: string){
        const image = await prisma.image.findUnique({
            where: {
                hashName: name
            }
        })
        return image
    }

    async list(){
        const images = await prisma.image.findMany()
        return images
    }

    async listByUser(id: string){
        const images = await prisma.image.findMany({
            where: {
                userId: id
            }
        })

        return images
    }
    
    async findById(id: string){
        const image = await prisma.image.findUnique({
            where:{id}
        })

        return image
    }

    async upload(data: Prisma.ImageUncheckedCreateInput){
        const image = await prisma.image.create({
            data
        })

        return image
    }
    
    async updateUrl(data: Prisma.ImageUncheckedUpdateInput){
        await prisma.image.update({
            where: {
                id: data.id as string
            },
            data: {
                url: data.url as string
            }
        })
    }
    
    async deleteById(id: string) {
        await prisma.image.delete({
            where: {
                id
            }
        })
    }

}