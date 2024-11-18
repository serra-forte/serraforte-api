import { Category, Prisma } from "@prisma/client"

export interface ICategoriesRepository{
    create(data:Prisma.CategoryUncheckedCreateInput):Promise<Category>
    list():Promise<Category[]>
    findById(id:string):Promise<Category | null>
    findByName(name:string):Promise<Category | null>
    updateById(data:Prisma.CategoryUncheckedUpdateInput):Promise<Category>
    deleteById(id:string):Promise<void>
}