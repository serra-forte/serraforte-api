import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { ShoppingCart } from "@prisma/client";

export interface IRequestFindShoppingCart {
    id: string
}

export class FindShoppingCartUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
    ) {}

    async execute({
         id,
    }: IRequestFindShoppingCart):Promise<IShoppingCartRelationsDTO> {
        // buscar carrinho pelo id
        const findShoppingCartExists = await this.shoppingCartsRepository.findByUserId(id)

        // validar se carrinho existe
        if(!findShoppingCartExists){
            throw new Error('Carrinho não encontrado')
        }

        // retornar carrinho
        return findShoppingCartExists
    }
}