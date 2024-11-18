import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { UpdateBoxesUseCase } from "@/usecases/boxes/update/update-boxes-usecase";

export async function makeUpdateBoxes(): Promise<UpdateBoxesUseCase>{
    const boxesRepository = new PrismaBoxesRepository()

    const updateBoxesUseCase = new UpdateBoxesUseCase(boxesRepository)

    return updateBoxesUseCase
}