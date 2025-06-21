import { IRemoteConfigProvider } from "@/providers/RemoteConfigProvider/interface-remote-config-provider";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestDeleteCartItem {
    shoppingCartId: string
}

export class DeleteAllCartItemUseCase {
    constructor(
        private shoppingCartsRepository: IShoppingCartRepository,
        private cartItemRepository: ICartItemRepository,
        private remoteConfig: IRemoteConfigProvider
    ) {}

    async execute({
        shoppingCartId,
    }: IRequestDeleteCartItem):Promise<void> {
        // buscar carrinho pelo id
        const findShoppingCartExists = await this.shoppingCartsRepository.findById(shoppingCartId)

        // validar se carrinho existe
        if(!findShoppingCartExists){
            throw new AppError('Carrinho não encontrado')
        }

        const isUpdating = await this.remoteConfig.getTemplate('systemStatus')

        if(!isUpdating){
            throw new AppError('The system is updating', 400)
        }

        // deletar itens do carrinho
        await this.cartItemRepository.deleteAllByShoppingCartId(shoppingCartId)

        // atualizar total do carrinho
        await this.shoppingCartsRepository.updateTotal(shoppingCartId, 0)
    }
}