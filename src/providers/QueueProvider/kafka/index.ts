import { env } from '@/env';
import { Kafka } from 'kafkajs';

// Criar a instância do Kafka com as configurações corretas
export const kafka = new Kafka({
    clientId: "serraforte", // Identificador do cliente
    brokers: env.NODE_ENV === "development"
        ? ["localhost:9092"] // IPv4 local
        : [`[${env.KAFKA_PRIVATE_URL}]:29092`] // Endereço IPv6 com porta
});
