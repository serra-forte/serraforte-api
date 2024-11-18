import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateAddressUseCase } from "@/usecases/address/create/create-address-usecase";

export async function makeCreateAddress(): Promise<CreateAddressUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const usersRepository = new PrismaUsersRepository();
    const createAddressUseCase = new CreateAddressUseCase(addressRepository,usersRepository)

    return createAddressUseCase
}