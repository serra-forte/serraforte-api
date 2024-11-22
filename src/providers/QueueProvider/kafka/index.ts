import { env } from '@/env';
import { Kafka } from 'kafkajs';

// Criar a instância do Kafka com as configurações corretas
export const kafka = new Kafka({
    clientId: "serraforte", // Identificador do cliente
    brokers: env.NODE_ENV === "development" ? ["localhost:9092"] : [`${env.KAFKA_PRIVATE_URL}`], // Broker interno (utilize o nome do host adequado)
});
