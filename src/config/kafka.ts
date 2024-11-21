import { Kafka } from "kafkajs";

export const kafka =  new Kafka({
    clientId: "serraforte",
    brokers: process.env.NODE_ENV === 'production' 
    ? ['kafka-service:9092']  // para produção no Railway
    : ['localhost:9092'],      // para desenvolvimento local
});

