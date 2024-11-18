import { PrismaImageRepository } from "@/repositories/prisma/prisma-images-repository";
import { ListImageUseCase } from "@/usecases/images/list/list-images-usecase";

export async function makeListImage(): Promise<ListImageUseCase> {
    const imageRepository = new PrismaImageRepository()
    const listImageUseCase = new ListImageUseCase(
        imageRepository,
    )

    return listImageUseCase
}