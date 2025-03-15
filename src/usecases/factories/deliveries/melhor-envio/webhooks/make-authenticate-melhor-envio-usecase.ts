import { KafkaProducer } from "@/providers/QueueProvider/kafka/kafka-producer"
import { WebHookGetStatusLabelUseCase } from "@/usecases/deliveries/melhor-envio/webhooks/get-status-label-usecase"

export async function makeWebHookGetStatusLabel(): Promise<WebHookGetStatusLabelUseCase>{
    const kafkaProducer = new KafkaProducer()
    const webHookGetStatusLabelUseCase  = new WebHookGetStatusLabelUseCase(kafkaProducer)
    return webHookGetStatusLabelUseCase 
}