import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register-usecase";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { InMemoryMailProvider, Message } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { AppError } from "@/usecases/errors/app-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let stu: RegisterUseCase;

describe("Register user (unit)", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        stu = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
    });

    test("Should be able to register a new account with cpf", async () => {
        const { user } = await stu.execute({ 
            email: 'email@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
        });

        // confirmar se email foi enviado
        const message = await sendMailProvider.findMessageSent(user.email) as Message
        expect(user.id).toEqual(expect.any(String))
        expect(message).toEqual(
            expect.objectContaining({
                subject: 'Confirmação de email',
            })
        )
    });
    
    test("Should not be able to register a new account with Email already exists", async () => {
        const email = 'email@test.com'

        await stu.execute({ 
            email,
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        });

       await expect(()=> stu.execute({
            email,
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
        }),
        ).rejects.toEqual(new AppError('Email já cadastrado', 409))
    });
});