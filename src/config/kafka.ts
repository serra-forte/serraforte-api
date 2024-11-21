import { Kafka } from "kafkajs";

export const kafka =  new Kafka({
    clientId: "serraforte",
    brokers: [`https://kafka-broker-production-37ae.up.railway.app:9092`], // teste http://localhost:9092
});

