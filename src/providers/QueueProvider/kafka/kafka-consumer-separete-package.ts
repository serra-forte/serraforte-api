import { kafka } from "."

export class KafkaConsumerSeparetePackage {
    async execute(topic: string) {
        // criar consumer com um grupo de id para ficar escutando as mensagens
        const consumer = kafka.consumer({
            groupId: 'APP_SEPARETE_PACKAGE',
        })

        // criar conexão com o consumer
        await consumer.connect()
        
        console.info('Consumer separate package connected. . .')

        // assianr para ficar escutando as mensagens do topico assinado
        await consumer.subscribe({ topic, fromBeginning: true })

        // retornar consumer criado
        return consumer
    }
}