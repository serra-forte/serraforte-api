import { Kafka } from 'kafkajs';

// Criar a instância do Kafka com as configurações corretas
export const kafka = new Kafka({
    clientId: "serraforte", // Identificador do cliente
    brokers: ["kafka.railway.internal:29092"], // Broker interno (utilize o nome do host adequado)
});
