import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { VerifyEmailUseCase } from "./verify-email-usecase";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { RegisterUseCase } from "../register/register-usecase";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";
import { User } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase;
let stu: VerifyEmailUseCase;

describe("Verify email user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        registerUseCase = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
        stu = new VerifyEmailUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory,
            dayjsDateProvider
        )

        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useFakeTimers()
    })

    test("Should be able to verify a new account", async () => {
        const {user} = await registerUseCase.execute({
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id)

        await stu.execute({ 
            token: userToken?.token as string,
            email: 'user1-test@email.com'
        });

        const userActive = await usersRepositoryInMemory.findByEmail('user1-test@email.com') as User

        expect(userActive.emailActive).toBe(true)
    });

    test("Should not be able to verify a new account with email already exists", async () => {
        const email = 'email@notexists.com'

        const {user} = await registerUseCase.execute({
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id)

       await expect(()=> stu.execute({ 
        token: userToken?.token as string,
        email,
    }),
        ).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

    test("Should not be able to verify a account with token not found", async () => {
        const {user} = await registerUseCase.execute({
            email: 'user1-test@email.com',
            name: 'John Doe',
            password: await hash('123456', 8),
        })

       await expect(()=> stu.execute({ 
        token: 'xxx',
        email: 'user1-test@email.com',
    }),
        ).rejects.toEqual(new AppError('Token não encontrado', 404))  
    });
});