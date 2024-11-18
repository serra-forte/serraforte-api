import { Item } from "@prisma/client";

export interface IItemsRepository {
    findById(id: string): Promise<Item | null>
}    