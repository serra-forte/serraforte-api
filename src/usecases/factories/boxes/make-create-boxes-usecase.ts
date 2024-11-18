import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { CreateBoxesUseCase } from "@/usecases/boxes/create/create-boxes-usecase";

export async function makeCreateBoxes(): Promise<CreateBoxesUseCase>{
    const boxesRepository = new PrismaBoxesRepository()

    const createBoxesUseCase = new CreateBoxesUseCase(boxesRepository)

    return createBoxesUseCase
}