import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer"
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository"
import { WebHookGetStatusLabelUseCase } from "@/usecases/deliveries/melhor-envio/webhooks/get-status-label-usecase"

export async function makeWebHookGetStatusLabel(): Promise<WebHookGetStatusLabelUseCase>{
    const kafkaProducer = new KafkaProducer()
    const deliveryRepository = new PrismaDeliveryRepository()
    const webHookGetStatusLabelUseCase  = new WebHookGetStatusLabelUseCase(kafkaProducer, deliveryRepository)
    return webHookGetStatusLabelUseCase 
}