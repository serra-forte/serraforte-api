import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto"
import { Prisma, ShoppingCart } from "@prisma/client"

export interface IShoppingCartRepository{
    create(data:Prisma.ShoppingCartUncheckedCreateInput):Promise<ShoppingCart>
    list():Promise<ShoppingCart[]>
    findByUserId(userId: string):Promise<IShoppingCartRelationsDTO | null> 
    findById(id:string):Promise<ShoppingCart | null>
    deleteById(id:string):Promise<void>
    updateTotal(id:string, total:number):Promise<ShoppingCart>
}