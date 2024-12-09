import { kafka } from "@/providers/QueueProvider/kafka";

export class KafkaProducer {
    async execute(topic: string, paylod: any) {
        const producer = kafka.producer({
            allowAutoTopicCreation: true
        })
    
        await producer.connect()

        console.info('Producer connected. . .')
    
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(paylod)
                }
            ]
        })
    
        await producer.disconnect()
    }
}
