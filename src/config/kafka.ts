import { Kafka } from "kafkajs";

export const kafka =  new Kafka({
    clientId: "serraforte",
    brokers: ["kafka:9092"],

});

