import { PrismaCancellationRepository } from "@/repositories/prisma/prisma-cancellation-repository";
import { PrismaNotificationRepository } from "@/repositories/prisma/prsma-notification-repository";
import { ToggleIsReadNotificationUseCase } from "@/usecases/notifications/toggle-is-read/toggle-is-read-notification-usecase";

export async function makeToggleIsReadNotification(): Promise<ToggleIsReadNotificationUseCase> {
    const notificationsRepository = new PrismaNotificationRepository();
    const cancellationsRepository = new PrismaCancellationRepository();

    const toggleIsReadNotificationUseCase = new ToggleIsReadNotificationUseCase(
        notificationsRepository,
        cancellationsRepository
    )

    return toggleIsReadNotificationUseCase
}