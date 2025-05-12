import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider"
import { ListItemsUseCase } from "@/usecases/erp/list-items-usecase"

export async function makeListItems(): Promise<ListItemsUseCase>{
    const bierHeldProvider = new BierHeldProvider()

    const listItemsUseCase = new ListItemsUseCase(
        bierHeldProvider
    )

    return listItemsUseCase
}