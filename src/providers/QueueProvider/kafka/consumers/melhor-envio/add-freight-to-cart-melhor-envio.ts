import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { KafkaConsumer } from "../../kafka-consumer";

export class AddFreightToCartMelhorEnvio {
    async execute() {
        console.log('add-freight-to-cart')

        const consumer = new KafkaConsumer()

        const createdConsumer = await consumer.execute('add-freight-to-cart')

        createdConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value?.toString(),
                    topic: topic.toString(),
                    partition: partition.toString()
                })
            }
        })
    }
}

const kafkaConsumer = new AddFreightToCartMelhorEnvio()

kafkaConsumer.execute()