import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";
import {  ListAddressbyUserUseCase } from "@/usecases/address/list/list-usecase";

export async function makeListAddressByUser(): Promise<ListAddressbyUserUseCase> {
    const addressRepository = new PrismaAddressesRepository();
    const listAddressUseCase = new ListAddressbyUserUseCase(addressRepository)

    return listAddressUseCase
}