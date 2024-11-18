import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestDeleteBox {
    id: string;
}

export class DeleteBoxesUseCase {
    constructor(
        private boxesRepository: PrismaBoxesRepository
    ){}

    async execute({
        id,
    }: IRequestDeleteBox): Promise<void> {
        // buscar box pelo id
        const findBoxExists = await this.boxesRepository.findById(id)

        // validar se box existe
        if(!findBoxExists){
            throw new AppError('Box not found', 404)
        }

        // delete box pelo id
        await this.boxesRepository.deleteById(id)
    }
}