import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer";
import { IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { AppError } from "@/usecases/errors/app-error";
import { ApiError } from "@google-cloud/storage";

interface Tag {
    tag: string;
    url: string;
}
interface IRequestStatusLabel{
    event: string;
    data: {
        id: string;
        protocol: string;
        status: string;
        tracking: string | null;
        self_tracking: string | null;
        user_id: string;
        tags?: Tag[];
        created_at: string;
        paid_at: string | null;
        generated_at: string | null;
        posted_at?: string | null;
        delivered_at: string | null;
        canceled_at: string | null;
        expired_at: string | null;
        tracking_url?: string | null;
    };
}

export class WebHookGetStatusLabelUseCase {
    constructor(
        private kafkaProducer: KafkaProducer,
        private deleiveryRepository: IDeliveryRepository
    ) {}

    async execute({
        event,
        data,
    }: IRequestStatusLabel): Promise<void> {
        const delivery = await this.deleiveryRepository.findByFreightId(data.id)

        if (!delivery) {
            throw new AppError('Frete nao encontrado', 404);
        }

        switch (event) {
            case 'order.created':
                // Enviar mensagem para o Kafka para processar o pagamento
                await this.kafkaProducer.execute('PAYMENT_PROCESS_IN_CART',  {
                    freightId: data.id,
                    orderId: delivery.orderId
                })
                break;
            case 'order.released':
                // Enviar mensagem para gerar etiqueta
                await this.kafkaProducer.execute('GENERATE_LABEL', {
                    freightId: data.id,
                    orderId: delivery.orderId
                })
                break;
            case 'order.generated':
                // Enviar mensagem para gerar link da etiqueta
                await this.kafkaProducer.execute('GENERATE_LABEL_TO_PRINT', {
                    freightId: data.id,
                    orderId: delivery.orderId
                })
                break;
            case 'order.posted':
                // Enviar mensagem para gerar link da etiqueta
                await this.kafkaProducer.execute('GENERATE_TRACKING_LINK', {
                    freightId: data.id,
                    orderId: delivery.orderId
                })
                break;
            default:
                console.log('Evento desconhecido:', event);
                break;
        }
    }
}