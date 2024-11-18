import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { CreateAddressUseCase } from "./create-address-usecase";
import { AppError } from "@/usecases/errors/app-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: CreateAddressUseCase;

describe("Create address (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new CreateAddressUseCase(
            addressRepositoryInMemory, 
            usersRepositoryInMemory
            
        )

        await usersRepositoryInMemory.create({
            id:'2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'user-test@email.com',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 
    });

    test("Should be able to update a address", async () => {
        const address = await stu.execute({ 
            userId: '2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            city: 'city-user-2',
            country: 'country-user-2',
            district: 'district-user-2',
            num: 2,
            state: 'state-user-2',
            street: 'street-user-2',
            zipCode: 2,
            complement: 'complement-user-2',
            reference: 'reference-user-2',
        });
        expect(address).toEqual(
            expect.objectContaining({
                street: 'street-user-2',
                district: 'district-user-2',
                city: 'city-user-2',
                state: 'state-user-2',
                country: 'country-user-2',
                userId: '2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            }),
        )
    });

    test("Should not be able to update a address with invalid user", async () => {
        await expect(()=> stu.execute({ 
            userId: '5968ab6f-3e34-4e02-88b4-afc955d3dbde',
            city: 'city-user-2',
            country: 'country-user-2',
            district: 'district-user-2',
            num: 2,
            state: 'state-user-2',
            street: 'street-user-2',
            zipCode: 2,
            complement: 'complement-user-2',
            reference: 'reference-user-2',
        })).rejects.toEqual(new AppError('Usuário não encontrado', 404));
    });
});