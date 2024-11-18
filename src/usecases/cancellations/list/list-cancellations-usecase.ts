import { ICancellationRelationsDTO } from "@/dtos/cancellation-relations.dto";
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IResponseListCancellationsByUser } from "../list-by-shopkeeper/list-by-shopkeeper-cancellations-usecase";

interface IRequestListCancellations{
    page?: number | null
}
export class ListCancellationUseCase {
    constructor(
        private cancellationRepository: ICancellationRepository,
    ){}

    async execute({
        page
    }: IRequestListCancellations): Promise<IResponseListCancellationsByUser> {
        const cancellations = await this.cancellationRepository.list(page)

        return cancellations
    }
}