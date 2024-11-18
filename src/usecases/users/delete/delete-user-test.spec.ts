import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DeleteUserUseCase } from "./delete-user-usecase";
import { User } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: DeleteUserUseCase;

describe("Delete user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new DeleteUserUseCase(
            usersRepositoryInMemory, 
        )

         await usersRepositoryInMemory.create({
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            cpf: "524.658.490-93",
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to delete user", async () => {
        await stu.execute({
            id: 'bd3234d7-21e6-4e1d-8129-8b823c4d331a'
        });
        
        const findUserExist = await usersRepositoryInMemory.getUserSecurity('bd3234d7-21e6-4e1d-8129-8b823c4d331a') as User

        expect(findUserExist).toEqual(null)
    });

    test("Should not be able to delete a user is not exists ", async () => {
        await expect(()=> stu.execute({
            id: 'id-faker-user-2'
        }),
        ).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

})