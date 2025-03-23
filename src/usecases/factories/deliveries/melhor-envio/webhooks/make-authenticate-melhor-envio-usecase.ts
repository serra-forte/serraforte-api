import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer"
import { PrismaFreightRepository } from "@/repositories/prisma/prisma-freights-repository"
import { WebHookGetStatusLabelUseCase } from "@/usecases/deliveries/melhor-envio/webhooks/get-status-label-usecase"

export async function makeWebHookGetStatusLabel(): Promise<WebHookGetStatusLabelUseCase>{
    const kafkaProducer = new KafkaProducer()
    const freightRepository = new PrismaFreightRepository()
    const webHookGetStatusLabelUseCase  = new WebHookGetStatusLabelUseCase(kafkaProducer, freightRepository)
    return webHookGetStatusLabelUseCase 
}