import { IItemsRepository } from "@/repositories/interfaces/interface-items-repository";
import { Item } from "@prisma/client";

export interface IRequestVerItem{
    id: string
}
export class VerItemOrderUseCase{
    constructor(
        private itemRepository: IItemsRepository
    ){}

    async execute({ id }: IRequestVerItem): Promise<Item>{
        // buscar item pelo id
        const findItemExists = await this.itemRepository.findById(id)

        // validar se item existe
        if(!findItemExists){
            throw new Error('Item não encontrado')
        }

        return findItemExists
    }
}