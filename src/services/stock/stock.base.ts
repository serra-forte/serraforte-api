import { CartItem } from "@prisma/client";

export abstract class StockServiceBase {
    abstract increment(params:CartItem[]): Promise<boolean>
    abstract decrement(params:CartItem[]): Promise<boolean>
    abstract check(params:CartItem[]): Promise<void>
}