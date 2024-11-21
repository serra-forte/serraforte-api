import { kafka } from "@/config/kafka";
import { Partitioners } from "kafkajs";

export const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.LegacyPartitioner, // Use o LegacyPartitioner
})

producer.connect().then(() => {
    console.log("Kafka producer connected");
})