import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Order } from "@prisma/client";

interface IRequestFindOrder{
    id: string
}

export class FindOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
    ){}

    async execute({
        id
    }: IRequestFindOrder): Promise<IOrderRelationsDTO> {
        // buscar pedido pelo id
        const findOrderExist = await this.orderRepository.findById(id)

        // validar se pedido existe
        if(!findOrderExist){
            throw new AppError("Pedido não encontrado", 404)
        }

        return findOrderExist
    }
}