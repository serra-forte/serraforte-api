import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer";
import { IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { IFreightsRepository } from "@/repositories/interfaces/interface-freights-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
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
        private freightRepository: IFreightsRepository,
        private deliveryRepository: IDeliveryRepository,
        private orderRepository: IOrderRepository
    ) {}

    async execute({
        event,
        data,
    }: IRequestStatusLabel): Promise<void> {
        console.log('Event:', event);
        console.log('Data:', data);
        const freight = await this.freightRepository.findByFreightId(data.id)

        if (!freight) {
            throw new AppError('Frete nao encontrado', 404);
        }

        switch (event) {
            case 'order.created':
                // Enviar mensagem para o Kafka para processar o pagamento
                await this.kafkaProducer.execute('PAYMENT_PROCESS_IN_CART',  {
                    freightId: data.id,
                    deliveryId: freight.deliveryId
                })
                break;
            case 'order.released':
                // Enviar mensagem para gerar etiqueta
                await this.kafkaProducer.execute('GENERATE_LABEL', {
                    freightId: data.id,
                    deliveryId: freight.deliveryId
                })
                break;

            case 'order.posted':{
               const savedFreight = await this.freightRepository.save( {
                    freightId: data.id,
                    trackingLink: data.tracking_url
                })

                if (!savedFreight) {
                    throw new AppError('Erro ao salvar frete');
                }

                const delivery = await this.deliveryRepository.findById(freight.deliveryId)

                if (!delivery) {
                    throw new AppError('Entrega nao encontrada', 404);
                }

                await this.orderRepository.updateStatus(delivery.orderId, 'LABEL_GENERATED')
            }
            default:
                console.log('Evento desconhecido:', event);
            break;
        }
    }
}