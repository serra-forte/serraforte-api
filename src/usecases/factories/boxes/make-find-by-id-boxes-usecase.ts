import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { FindByIdBoxesUseCase } from "@/usecases/boxes/find-by-id/find-by-id-boxes-usecase";

export async function makeFindByIdBox(): Promise<FindByIdBoxesUseCase>{
    const boxesRepository = new PrismaBoxesRepository()

    const findbyidBoxesUseCase = new FindByIdBoxesUseCase(boxesRepository)

    return findbyidBoxesUseCase
}