import { IAsaasProvider } from "@/providers/PaymentProvider/interface-asaas-payment";
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository"
import { IPaymentsRepository } from "@/repositories/interfaces/interface-payments-repository";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { AppError } from "@/usecases/errors/app-error"
import { Status } from '@prisma/client';

interface IRequestChangeStatusCancellation{
    cancellationId: string
    status: string
}

export class ChangeStatusCancellationUseCase {
    constructor(
        private cancellationRepository: ICancellationRepository,
        private paymentRepository: IPaymentsRepository,
        private productsRepository: IProductsRepository,
        private asaasProvider: IAsaasProvider   
        ) {}

    async execute({
        cancellationId,
        status
    }: IRequestChangeStatusCancellation): Promise<void>{
        // buscar cancelamento pelo id
        const findCancellationExist = await this.cancellationRepository.findById(cancellationId)

        // validar se existe cancelamento com o mesmo id
        if(!findCancellationExist){
            throw new AppError('Cancelamento não encontrado', 404)
        }
        
        // se status for aprovado
        if(status === Status.APPROVED){
            // alterar status do cancelamento
            await this.cancellationRepository.changeStatus(cancellationId, Status.REFUNDED)

            // alterar pagamento do pedido para estornado
            await this.paymentRepository.updateStatus(findCancellationExist.order.payment.id, Status.REFUNDED)

            // cancelar fatura na asaas
            await this.asaasProvider.cancelPayment(findCancellationExist.order.payment.asaasPaymentId as string)
            
            // atualizar estoque com o produto devolvido
            for(let item of findCancellationExist.order.items){
                const quantity = Number(item.quantity)

                // atualizar a quantidade do item no estoque do produto
                await this.productsRepository.incrementQuantity(item.productId, quantity)
            }
            return
        }

        // se status for reprovado
        await this.cancellationRepository.changeStatus(cancellationId, Status.REPROVED)
    }
}