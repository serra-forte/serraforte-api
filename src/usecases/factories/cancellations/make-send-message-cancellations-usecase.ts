import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaCancellationMessagesRepository } from "@/repositories/prisma/prisma-cancellation-messages-repository";
import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaNotificationRepository } from "@/repositories/prisma/prsma-notification-repository";
import { SendMessageCancellationsUseCase } from "@/usecases/cancellations/send-message/send-message-cancellations-usecase";

export async function makeSendMessageToCancellation(): Promise<SendMessageCancellationsUseCase> {
    const cancellationsRepository = new PrismaCancellationRepository()
    const cancellarionMessageRepository = new PrismaCancellationMessagesRepository()
    const notificationsRepository = new PrismaNotificationRepository()
    const dayjsProvider = new DayjsDateProvider()
    const etherealProvider = await EtherealProvider.createTransporter()
    const mailProvider = new MailProvider
    const userRepository = new PrismaUsersRepository()

    const sendMessageCancellationsUseCase = new SendMessageCancellationsUseCase(
        cancellarionMessageRepository,
        cancellationsRepository,
        notificationsRepository,
        dayjsProvider,
        etherealProvider,
        mailProvider,
        userRepository
    )

    return sendMessageCancellationsUseCase
}