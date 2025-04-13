import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository"
import { Address } from "@prisma/client"

export interface IListAddressUseCase {
    userId: string  
}

export class ListAddressbyUserUseCase {

    constructor(
        private addressRepository: IAddressesRepository
    ){}

    async execute(
        {userId}:IListAddressUseCase
    ): Promise<Address[]> {
        // listar todos os produtos
        const address = await this.addressRepository.listByUser(userId)

        return address
    }
}