import { $Enums, Category, Prisma, TypeCategory } from "@prisma/client";
import { ICategoriesRepository } from "../interface-categories-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCategoriesRepository implements ICategoriesRepository{
    private categories: Category[] = []
    constructor(){}
    async listByType(type: $Enums.TypeCategory){
        return this.categories.filter(category => category.type === type)
    }
    
    async create({
        id,
        name,
        type,
        description,
    }: Prisma.CategoryCreateInput){
        const category =  {
            id: id ? id : randomUUID(),
            name,
            type,
            description: description ? description : null
        }

        this.categories.push(category)

        return category
    }

    async list(){
        return this.categories
    }

    async findById(id: string){
        const category = this.categories.find(category => category.id === id)

        if(!category){
            return null
        }

        return category
    }

    async updateById({
        id,
        name,
        type,
        description,
    }:Prisma.CategoryUncheckedUpdateInput): Promise<Category> {
        const categoryIndex = this.categories.findIndex(category => category.id === id)

        this.categories[categoryIndex].description = description as string
        this.categories[categoryIndex].name = name as string
        this.categories[categoryIndex].type = type as TypeCategory

        return this.categories[categoryIndex]
    }

    async deleteById(id: string) {
        const categoryIndex = this.categories.findIndex(category => category.id === id)

        this.categories.splice(categoryIndex, 1)
    }
}