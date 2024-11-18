import { Category, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ICategoriesRepository } from "../interfaces/interface-categories-repository";

 export class PrismaCategoryRepository implements ICategoriesRepository{
     async findByName(name: string) {
        const category = await prisma.category.findUnique({
            where: { name } 
        })

        return category
     }
     async create(data: Prisma.CategoryUncheckedCreateInput){
         const category = await prisma.category.create({data})

         return category
     }

     async list(){
        return prisma.category.findMany({
            select:{
                id: true,
                name: true,
                description: true,
                color: true,
                image: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        }) as unknown as Category[]
     }

     async findById(id: string){
        const category = await prisma.category.findUnique({
            where:{id}
        })

        return category
     }

     async updateById(data: Prisma.CategoryUncheckedUpdateInput){
        const category = await prisma.category.update({
            where:{id: data.id as string},
            data
        })

        return category
     }

     async deleteById(id: string){
        await prisma.category.delete({
            where: {id}
        })
     }
}