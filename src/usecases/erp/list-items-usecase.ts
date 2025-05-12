import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";

export interface IRequestListItems {
    client_id: number;
    page?: number;
    per_page?: number;
    search?: string;
}

export class ListItemsUseCase {
    constructor(
        private bierHeldProvider: IBierHeldProvider
    ){}
    async execute({
        client_id,
        page,
        per_page,
        search
    }: IRequestListItems) {
        const listItems = await this.bierHeldProvider.litItems({
            client_id,
            page,
            per_page,
            item_filters: {
                search 
            }
        })

        return listItems
    }
}