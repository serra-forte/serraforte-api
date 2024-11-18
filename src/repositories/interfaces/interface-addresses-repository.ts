import { Address, Prisma } from "@prisma/client"

export interface IAddressesRepository {
    create(data:Prisma.AddressUncheckedCreateInput):Promise<Address>
    findById(id:string):Promise<Address | null>
    updateById(data:Prisma.AddressUncheckedUpdateInput):Promise<Address>
    deleteById(id: string): Promise<void>
}