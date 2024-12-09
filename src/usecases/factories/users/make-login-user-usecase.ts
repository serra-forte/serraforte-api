import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaTokensRepository } from "@/repositories/prisma/prisma-tokens-repository";
import { LoginUseCase } from "@/usecases/users/login/login-usecase";
import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer";

export async function makeLoginUser(): Promise<LoginUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const usersTokensRepository = new PrismaTokensRepository();
    const kafkaProvider = new KafkaProducer();
    const dayjsDateProvider = new DayjsDateProvider();
    const loginUseCase = new LoginUseCase(
        usersRepository,
        usersTokensRepository,
        dayjsDateProvider,
        kafkaProvider
    )

    return loginUseCase
}