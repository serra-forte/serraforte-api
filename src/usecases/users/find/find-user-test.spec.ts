import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { FindUserUseCase } from "./find-user-usecase";
import { hash } from "bcrypt";
import { AppError } from "@/usecases/errors/app-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: FindUserUseCase;

describe("Find user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new FindUserUseCase(
            usersRepositoryInMemory, 
        )

         await usersRepositoryInMemory.create({
            id:'id-user-1',
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'user-test@email.com',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to find user", async () => {
        const findUser = await stu.execute({
            id: 'id-user-1'
        });
        expect(findUser.user).toEqual(
            expect.objectContaining({
                id: 'id-user-1'
            })
        )
    });

    test("Should not be able to find user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

})