import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { UpdateUserUseCase } from "./update-user-usecase";
import { AppError } from "@/usecases/errors/app-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdateUserUseCase;

describe("Update user (unit)", () => {
    beforeEach(async() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new UpdateUserUseCase(
            usersRepositoryInMemory, 
        )

        await usersRepositoryInMemory.create({
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            cpf: "524.658.490-93",
            passport: '123456789',
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to update a user account with cpf", async () => {
        const { user } = await stu.execute({ 
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
            cpf: '45274090001'
        });
        expect(user).toEqual(
            expect.objectContaining({
                id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
                dateBirth: new Date('1995-10-03'),
                phone: '77-7777-9999',
                name: 'Sarah Moreira',
                cpf: '45274090001'
            }),
        )
    });

    test("Should be able to update a user account with passport", async () => {
        const { user } = await stu.execute({ 
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
            passport: '987654321',
        });
        expect(user).toEqual(
            expect.objectContaining({
                id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
                dateBirth: new Date('1995-10-03'),
                phone: '77-7777-9999',
                name: 'Sarah Moreira',
                passport: '987654321',
            }),
        )
    });

    test("Should not be able to update a user account with id invalid", async () => {
        await expect(()=> stu.execute({ 
            id: 'id-user-3',
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
        })).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

    test("Should not be able to update a user account with cpf already exists", async () => {
        await expect(()=> stu.execute({ 
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
            cpf: '524.658.490-93'
        })).rejects.toEqual(new AppError('CPF já cadastrado', 409))
    });

    test("Should not be able to update a user account with passport already exists", async () => {
        await expect(()=> stu.execute({ 
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
            passport: '123456789'
        })).rejects.toEqual(new AppError('Passaporte já cadastrado', 409))
    });

});