import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";
import { VerItemOrderUseCase } from "@/usecases/orders/ver-item/ver-item-oder-usecase";

export async function makeVerItemOrder(): Promise<VerItemOrderUseCase> {
    const itemRepository = new PrismaItemsRepository();

    const verItemOrderUseCase = new VerItemOrderUseCase(itemRepository);

    return verItemOrderUseCase;
}