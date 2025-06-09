import { CartItem } from "@prisma/client";

export abstract class ShoppingCartServiceBase {
    abstract clear(shoppingCartId: string): Promise<boolean>
    abstract getTotal(userId: string): Promise<number>
    abstract getItems(userId: string): Promise<CartItem[]>
}