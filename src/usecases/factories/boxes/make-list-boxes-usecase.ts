import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { ListBoxesUseCase } from "@/usecases/boxes/list/list-boxes-usecase";

export async function makeListBoxes(): Promise<ListBoxesUseCase>{
    const boxesRepository = new PrismaBoxesRepository()

    const listBoxesUseCase = new ListBoxesUseCase(boxesRepository)

    return listBoxesUseCase
}