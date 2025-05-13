import { CartItem, Prisma } from "@prisma/client";

export interface ICartItemRepository {
    create(data:Prisma.CartItemUncheckedCreateInput):Promise<CartItem>
    list():Promise<CartItem[]>  
    listByShoppingCartId(shoppingCartId:string):Promise<CartItem[]>
    findById(id:string):Promise<CartItem | null>
    incrementCartItemById(id: string, value:number): Promise<CartItem>
    decrementCartItemById(id: string, value:number): Promise<CartItem>
    deleteAllCartItemByShoppingCartId(shoppingCartId: string): Promise<void>
    deleteById(id:string):Promise<void>
    deleteAllByShoppingCartId(shoppingCartId: string):Promise<void>
    updatePrice(id: string, price: number): Promise<CartItem>
}