import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";

export interface IRequestGetItems {
    id: number
}

export class GetItemUseCase {
    constructor(
        private bierHeldProvider: IBierHeldProvider
    ){}
    async execute({
        id
    }: IRequestGetItems) {
        const findItem = await this.bierHeldProvider.getItem(id)

        if(!findItem){
            throw new Error('Item não encontrado')
        }

        return findItem
    }
}