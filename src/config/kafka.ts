import { env } from "@/env";
import { Kafka } from "kafkajs";

export const kafka =  new Kafka({
    clientId: "serraforte",
    brokers: [`${env.KAFKA_PUBLIC_URL}:9092`], // teste http://localhost:9092
});

