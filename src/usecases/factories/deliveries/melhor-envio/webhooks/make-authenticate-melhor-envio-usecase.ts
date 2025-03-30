import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer"
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository"
import { PrismaFreightRepository } from "@/repositories/prisma/prisma-freights-repository"
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository"
import { WebHookGetStatusLabelUseCase } from "@/usecases/deliveries/melhor-envio/webhooks/get-status-label-usecase"

export async function makeWebHookGetStatusLabel(): Promise<WebHookGetStatusLabelUseCase>{
    const kafkaProducer = new KafkaProducer()
    const deliveryRepository = new PrismaDeliveryRepository()    
    const orderRepository = new PrismaOrderRepository()
    const freightRepository = new PrismaFreightRepository()
    const webHookGetStatusLabelUseCase  = new WebHookGetStatusLabelUseCase(
        kafkaProducer, 
        freightRepository,
        deliveryRepository, orderRepository
    )
    return webHookGetStatusLabelUseCase 
}