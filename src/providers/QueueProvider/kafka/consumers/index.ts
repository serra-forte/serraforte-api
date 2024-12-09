import { AddFreightToCartMelhorEnvio } from "./melhor-envio/add-freight-to-cart-melhor-envio";
import { PaymentProcessInCartMelhorEnvio } from "./melhor-envio/payment-process-in-cart-melhor-envio";

export class ConsumerManager{
    private consumers: any[] = [];

    constructor() {
        // Inicialize todas as classes dos consumers
        this.consumers.push(new AddFreightToCartMelhorEnvio());
        this.consumers.push(new PaymentProcessInCartMelhorEnvio());
    }

    public async startAll(): Promise<void> {
        try {
            console.info("[ConsumerManager] Iniciando todos os consumers...");
            const promises = this.consumers.map((consumer) => consumer.execute());
            await Promise.all(promises); // Aguarda a inicialização de todos os consumers
            console.info("[ConsumerManager] Todos os consumers foram iniciados com sucesso!");
        } catch (error) {
            console.error("[ConsumerManager] Erro ao iniciar os consumers:", error);
        }
    }
}