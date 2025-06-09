import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { AppError } from "@/usecases/errors/app-error";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found.error";
import { StockServiceBase } from "./stock.base";
import { PRODUCT_NOT_FOUND } from "@/usecases/errors/error-codes";
import { CartItem } from "@prisma/client";

export class StockService implements StockServiceBase {
    constructor(
        private productsRepository: IProductsRepository,
    ) {
    }
    async decrement(params:CartItem[]) {
        try{
            await this.check(params)

            await Promise.all(
                params.map(async ({ productId, quantity }) => {
                    const product = await this.productsRepository.decrementQuantity(productId, quantity)

                    if(!product) {
                        throw new AppError('Erro ao decrementar o estoque', 500)
                    }
                })
            )
            return true
        } catch (error) {
            throw error
        }
    }

    async increment(params:CartItem[]) {
        try{
            await this.check(params)

            await Promise.all(
                params.map(async ({ id, quantity }) => {
                    const product = await this.productsRepository.incrementQuantity(id, quantity)

                    if(!product) {
                        throw new AppError('Erro ao decrementar o estoque', 500)
                    }
                })
            )
            return true
        } catch (error) {
            throw error
        }
    }

    async check(params:CartItem[]) {
       try{
            await Promise.all(
                    params.map(async ({ productId, quantity }) => {
                    const foundProduct = await this.productsRepository.findById(productId);

                    if (!foundProduct) {
                        throw new ResourceNotFoundError(PRODUCT_NOT_FOUND);
                    }

                    if (foundProduct.product.quantity < quantity) {
                        throw new AppError(`Quantidade solicitada fora de estoque para o produto ${productId}`, 400);
                    }
                })
            );
       } catch (error) {
         throw error
       }
    }
}