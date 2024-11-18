import { Image, Prisma } from "@prisma/client";

export interface IImagesRepository {
    upload(data: Prisma.ImageUncheckedCreateInput):Promise<Image>
    findById(id: string): Promise<Image | null>
    findByHashName(name: string): Promise<Image | null>
    deleteById(id: string):Promise<void>  
    list(): Promise<Image[]>
    listByUser(id:string): Promise<Image[]>       
}