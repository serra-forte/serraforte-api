import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { DeleteBoxesUseCase } from "@/usecases/boxes/delete/delete-boxes-usecase";

export async function makeDeleteBoxes(): Promise<DeleteBoxesUseCase>{
    const boxesRepository = new PrismaBoxesRepository()

    const deleteBoxesUseCase = new DeleteBoxesUseCase(boxesRepository)

    return deleteBoxesUseCase
}