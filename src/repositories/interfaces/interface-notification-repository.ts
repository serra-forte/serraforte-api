import { Notification, Prisma } from '@prisma/client';
export interface INotificationRepository {
    create(data: Prisma.NotificationUncheckedCreateInput): Promise<Notification>
    findByCancellationId(cancellationId: string): Promise<Notification | null>
    toggleIsRead(cancellationId: string, isRead: boolean): Promise<void>
}