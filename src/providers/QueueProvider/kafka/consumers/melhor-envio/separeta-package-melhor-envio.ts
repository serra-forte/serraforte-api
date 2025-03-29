import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { Address, Box, CartItem, Item } from "@prisma/client";
import { KafkaProducer } from "../../kafka-producer";
import { KafkaConsumerSeparetePackage } from "../../kafka-consumer-separete-package";

interface IRelationBox {
    box: Box
}

type OrderItem = {
    name: string;
    quantity: number;
    height: number;
    width: number;
    length: number;
    weight: number;
    price: number;
  };
  
  export type Package = {
    items: OrderItem[];
    totalWeight: number;
    dimensions: { height: number; width: number; length: number };
    companyName?: string | null;
    shopkeeperId: string;
    clientId?: string | null;
    address?: Address;
    serviceId?: number | null;
    total: number;
    deliveryId?: string | null;
    orderId?: string | null;
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

                    const limits = {
                        'Jadlog': { maxWeight: 120, maxSide: 80, maxSum: Infinity },
                        'Correios': { maxWeight: 30, maxSide: 80, maxSum: 200 },
                      };

                    const service = order.delivery.serviceDelivery.companyName as 'Jadlog' | 'Correios';
                    
                    const { maxWeight, maxSide, maxSum } = limits[service];
                
                    let packages: Package[] = [];
                    let currentPackage: Package = { 
                        items: [], 
                        totalWeight: 0, 
                        dimensions: { height: 0, width: 0, length: 0 }, 
                        companyName: order.delivery.serviceDelivery.companyName as 'Jadlog' | 'Correios',
                        shopkeeperId: order.items[0].userId as string,
                        clientId: order.user.id,
                        address: order.delivery.address as Address,
                        serviceId: Number(order.delivery.serviceDelivery.serviceId),
                        total: Number(order.total),
                        deliveryId: order.delivery.id,
                        orderId: order.id
                    };
                

                    for (let item of order.items) {
                        const quantity = Number(item.quantity);
                        const weight = Number(item.weight);
                        const length = Number(item.length);
                        const width = Number(item.width);
                        const height = Number(item.height);
                        const name = item.name as string;
                        const price = Number(item.price);
                        
                        let remainingQuantity = quantity; // Quantidade total do item a ser distribuída
                    
                        while (remainingQuantity > 0) { // Continua enquanto houver itens a serem alocados
                            let maxFitInCurrentPackage = remainingQuantity; // Quantidade máxima possível nesse pacote
                            
                            // Simula a adição do item ao pacote atual para verificar os limites
                            let newTotalWeight = currentPackage.totalWeight + (weight * maxFitInCurrentPackage);
                            let newHeight = Math.max(currentPackage.dimensions.height, height);
                            let newWidth = Math.max(currentPackage.dimensions.width, width);
                            let newLength = currentPackage.dimensions.length + (length * maxFitInCurrentPackage);
                            let newSumDimensions = newHeight + newWidth + newLength;
                    
                            const exceedsWeight = newTotalWeight > maxWeight;
                            const exceedsSide = newHeight > maxSide || newWidth > maxSide || newLength > maxSide;
                            const exceedsSum = maxSum !== Infinity && newSumDimensions > maxSum;
                    
                            // Se o item não cabe inteiro, reduz a quantidade para o que cabe no pacote atual
                            while ((exceedsWeight || exceedsSide || exceedsSum) && maxFitInCurrentPackage > 0) {
                                maxFitInCurrentPackage--;
                                newTotalWeight = currentPackage.totalWeight + (weight * maxFitInCurrentPackage);
                                newLength = currentPackage.dimensions.length + (length * maxFitInCurrentPackage);
                                newSumDimensions = newHeight + newWidth + newLength;
                            }
                    
                            if (maxFitInCurrentPackage === 0) {
                                // Se nem um único item couber, cria um novo pacote
                                packages.push({ ...currentPackage });
                    
                                currentPackage = { 
                                    items: [], 
                                    totalWeight: 0, 
                                    dimensions: { height: 0, width: 0, length: 0 },
                                    companyName: order.delivery.serviceDelivery.companyName as 'Jadlog' | 'Correios',
                                    shopkeeperId: order.items[0].userId as string,
                                    clientId: order.user.id,
                                    address: order.delivery.address as Address,
                                    serviceId: Number(order.delivery.serviceDelivery.serviceId),
                                    total: 0,
                                    deliveryId: order.delivery.id,
                                    orderId: order.id
                                };
                    
                                maxFitInCurrentPackage = remainingQuantity; // Tenta alocar tudo no novo pacote
                            } else {
                                // Adiciona o item ao pacote com a quantidade máxima permitida
                                currentPackage.items.push({
                                    name,
                                    quantity: maxFitInCurrentPackage, // Adiciona a quantidade máxima possível no pacote atual
                                    height,
                                    width,
                                    length,
                                    price,
                                    weight,
                                });
                    
                                currentPackage.totalWeight += weight * maxFitInCurrentPackage;
                                currentPackage.dimensions.height = Math.max(currentPackage.dimensions.height, height);
                                currentPackage.dimensions.width = Math.max(currentPackage.dimensions.width, width);
                                currentPackage.dimensions.length += length * maxFitInCurrentPackage;
                    
                                remainingQuantity -= maxFitInCurrentPackage; // Atualiza a quantidade restante para alocar
                            }
                        }
                    }
                    
                    
                    
                    // Adiciona o último pacote se houver itens
                    if (currentPackage.items.length > 0) {
                        packages.push(currentPackage);
                    }
                    await this.kafkaProducer.execute('ADD_FREIGHT_TO_CART', {packages});
                } catch (error) {
                    console.error('[Consumer - Separate Package] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const separatePackageMelhorEnvio = new SeparatePackageMelhorEnvio();
separatePackageMelhorEnvio.execute();

