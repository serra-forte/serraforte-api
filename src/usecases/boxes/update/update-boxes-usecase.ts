import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestUpdateBox {
    id:string
    name: string;
    description?: string | null;
    weight: number;
    height: number;
    length: number;
    width: number;
    amount: number;
}

export class UpdateBoxesUseCase {
    constructor(
        private boxesRepository: PrismaBoxesRepository
    ){}

    async execute({
        id,
        name,
        description,
        weight,
        amount,
        height,
        length,
        width
    }: IRequestUpdateBox) {
        // buscar box pelo id
        const findBoxExists = await this.boxesRepository.findById(id)

        // validar se box existe
        if(!findBoxExists){
            throw new AppError('Box not found', 404)
        }

        const box = await this.boxesRepository.updateById({
            id,
            name,
            description,
            weight,
            amount,
            height,
            length,
            width
        });
        
        return box;
    }
}