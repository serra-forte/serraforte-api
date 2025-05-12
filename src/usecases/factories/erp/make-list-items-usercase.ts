import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider"
import { GetItemUseCase } from "@/usecases/erp/list-items-usecase"

export async function makeGetItem(): Promise<GetItemUseCase>{
    const bierHeldProvider = new BierHeldProvider()

    const getItemUseCase = new GetItemUseCase(
        bierHeldProvider
    )

    return getItemUseCase
}