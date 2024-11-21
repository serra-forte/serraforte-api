import { Kafka } from "kafkajs";

export const kafka =  new Kafka({
    clientId: "serraforte",
    brokers: [`https://kafka-broker-production-09a9.up.railway.app:9092`], // teste http://localhost:9092
});

