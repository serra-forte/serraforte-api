import { prisma } from './../../lib/prisma';
import { Prisma } from "@prisma/client";
import { INotificationRepository } from "../interfaces/interface-notification-repository";

export class PrismaNotificationRepository implements INotificationRepository {
    async create(data: Prisma.NotificationUncheckedCreateInput) {
        const notification = await prisma.notification.create({
            data
        })

        return notification
    }
    async findByCancellationId(cancellationId: string) {
        const notification = await prisma.notification.findUnique({
            where: {
                cancellationId
            }
        })

        return notification
    }
    async toggleIsRead(cancellationId: string, isRead: boolean) {
        await prisma.notification.update({
            where: {
                cancellationId
            },
            data: {
                isRead
            }
        })
    }
}