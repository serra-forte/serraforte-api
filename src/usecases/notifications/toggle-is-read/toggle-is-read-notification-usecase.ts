import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { INotificationRepository } from "@/repositories/interfaces/interface-notification-repository";
import { AppError } from "@/usecases/errors/app-error";

interface ToggleIsReadRequest {
    cancellationId: string
    isRead: boolean
}

export class ToggleIsReadNotificationUseCase {

    constructor(
        private notificationsRepository: INotificationRepository,
        private cancellationRepository: ICancellationRepository
    ){}

    async execute({ cancellationId, isRead }: ToggleIsReadRequest) {
        // buscar pelo id do cancelamento
        const cancellation = await this.cancellationRepository.findById(cancellationId)

        // validar se o cancelamento existe
        if(!cancellation){
            throw new AppError('Cancelamento não encontrado',404)
        }

        // alterar isRead
        await this.notificationsRepository.toggleIsRead(cancellationId, isRead)
    }


}