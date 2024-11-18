import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateAddressUseCase } from "@/usecases/address/create/create-address-usecase";
import { UpdateAddressByIdUseCase } from "@/usecases/address/update-full/update-address-usecase";

export async function makeUpdateAddress(): Promise<UpdateAddressByIdUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const usersRepository = new PrismaUsersRepository();
    const updateAddressByIdUseCase = new UpdateAddressByIdUseCase(addressRepository,usersRepository)

    return updateAddressByIdUseCase
}