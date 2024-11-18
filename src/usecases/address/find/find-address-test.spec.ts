import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { FindAddressByIdUseCase } from "./find-address-usecase";
import { AppError } from "@/usecases/errors/app-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let stu: FindAddressByIdUseCase;

describe("Find address (unit)", () => {
    beforeEach(async () => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        stu = new FindAddressByIdUseCase(
            addressRepositoryInMemory, 
        )

         await addressRepositoryInMemory.create({
            id: 'c92b51df-a450-43b4-b26a-b96245fc0ada',
            city: 'city-user-1',
            country: 'country-user-1',
            district: 'district-user-1',
            num: 1,
            state: 'state-user-1',
            street: 'street-user-1',
            zipCode: 1,
        }); 

    });

    test("Should be able to find address", async () => {
        const findAddress = await stu.execute({
            id: 'c92b51df-a450-43b4-b26a-b96245fc0ada',
        });
        expect(findAddress).toEqual(
            expect.objectContaining({
                id: 'c92b51df-a450-43b4-b26a-b96245fc0ada'
            })
        )
    });

    test("Should not be able to find address is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toEqual(new AppError('Endereço não encontrado', 404))
    });

})