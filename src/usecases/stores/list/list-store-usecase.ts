import { IStoreRepository } from "@/repositories/interfaces/interface-store-repository";

export class ListStoreUseCase {
    constructor(
         private storeRepository: IStoreRepository
    ) {}

    async execute() {
        const stores = await this.storeRepository.list();
        return stores;
    }
}