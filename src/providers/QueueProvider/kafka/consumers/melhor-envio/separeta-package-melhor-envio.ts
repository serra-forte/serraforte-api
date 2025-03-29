import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { Box, CartItem, Item } from "@prisma/client";
import { KafkaProducer } from "../../kafka-producer";
import { KafkaConsumerSeparetePackage } from "../../kafka-consumer-separete-package";

interface IRelationBox {
    box: Box
}

type OrderItem = {
    quantity: number;
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  
  type Package = {
    items: OrderItem[];
    totalWeight: number;
    dimensions: { height: number; width: number; length: number };
  };

export class SeparatePackageMelhorEnvio {
    private kafkaConsumer: KafkaConsumerSeparetePackage;
    private kafkaProducer: KafkaProducer;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerSeparetePackage();
        this.kafkaProducer = new KafkaProducer();
        this.orderRepository = new PrismaOrderRepository();
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('SEPARATE_PACKAGE');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Separate Package] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Separate Package] Mensagem recebida:');

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        // console.warn('[Consumer - Freight] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    const order = parsedMessage as IOrderRelationsDTO;

                    console.log(order);

                    const limits = {
                        'Jadlog': { maxWeight: 120, maxSide: 80, maxSum: Infinity }, // Sem limite na soma das dimensões
                        'Correios': { maxWeight: 30, maxSide: 80, maxSum: 200 }, // Soma das dimensões ≤ 200 cm
                      };

                    const service = order.delivery.serviceDelivery.companyName as 'Jadlog' | 'Correios';
                    
                    const { maxWeight, maxSide, maxSum } = limits[service];
                
                    let packages: Package[] = [];
                    let currentPackage: Package = { items: [], totalWeight: 0, dimensions: { height: 0, width: 0, length: 0 } };
                

                    for (let item of order.items) {
                    const quantity = Number(item.quantity);
                    const weight = Number(item.weight);
                    const length = Number(item.length);
                    const width = Number(item.width);
                    const height = Number(item.height);
                    for (let i = 0; i < quantity; i++) {
                        let newTotalWeight = currentPackage.totalWeight + weight;
                        let newHeight = Math.max(currentPackage.dimensions.height, height);
                        let newWidth = Math.max(currentPackage.dimensions.width, width);
                        let newLength = currentPackage.dimensions.length + length;
                        let newSumDimensions = newHeight + newWidth + newLength;
                
                        // Verifica se ultrapassa os limites
                        const exceedsWeight = newTotalWeight > maxWeight;
                        const exceedsSide = newHeight > maxSide || newWidth > maxSide || newLength > maxSide;
                        const exceedsSum = maxSum !== Infinity && newSumDimensions > maxSum;
                
                        if (exceedsWeight || exceedsSide || exceedsSum) {
                        packages.push(currentPackage); // Salva o pacote atual
                        currentPackage = { items: [], totalWeight: 0, dimensions: { height: 0, width: 0, length: 0 } }; // Novo pacote
                        }
                
                        // Adiciona o item ao pacote
                        currentPackage.items.push({ height, width, length, weight, quantity:1 });
                        currentPackage.totalWeight += weight;
                        currentPackage.dimensions.height = Math.max(currentPackage.dimensions.height, height);
                        currentPackage.dimensions.width = Math.max(currentPackage.dimensions.width, width);
                        currentPackage.dimensions.length += length;
                    }
                    }
                
                    // Adiciona o último pacote se houver itens
                    if (currentPackage.items.length > 0) {
                        packages.push(currentPackage);
                    }
                    
                    console.log(packages)

                    // await this.kafkaProducer.execute('ADD_FREIGHT_TO_CART', package);
                } catch (error) {
                    console.error('[Consumer - Separate Package] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const separatePackageMelhorEnvio = new SeparatePackageMelhorEnvio();
separatePackageMelhorEnvio.execute();

