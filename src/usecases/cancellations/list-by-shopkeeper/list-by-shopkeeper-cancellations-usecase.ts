import { ICancellationRelationsDTO } from "@/dtos/cancellation-relations.dto";
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestListCancellationsByUser{
    shopkeeperId: string
    page?: number | null
}

export interface IResponseListCancellationsByUser{
    cancellations: ICancellationRelationsDTO[]
    totalPages: number
}

export class ListCancellationsByShopkeeperUseCase {
    constructor(
        private cancellationRepository: ICancellationRepository,
        private userRepository: IUsersRepository
    ){}

    async execute({
        shopkeeperId,
        page
    }: IRequestListCancellationsByUser): Promise<IResponseListCancellationsByUser> {
        // buscar por id do usuario
        const findUserExist = await this.userRepository.findById(shopkeeperId)

        // validar se o usuario existe
        if(!findUserExist) {
            throw new AppError("Usuário não encontrado", 404)
        }

        const cancellations = await this.cancellationRepository.listByShopkeeper(shopkeeperId, page)

        return cancellations
    }
}