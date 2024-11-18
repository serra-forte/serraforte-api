import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Box } from "@prisma/client";

export class ListBoxesUseCase {
    constructor(
        private boxesRepository: PrismaBoxesRepository
    ){}

    async execute(): Promise<Box[]> {
        const boxes = await this.boxesRepository.list()

        return boxes
    }
}