import { RemoteConfigProviderFirebase } from "@/providers/RemoteConfigProvider/implementations/provider-remote-config"
import { HasErpUseCase } from "@/usecases/system/has-erp/has-erp-usecase"

export async function makeHasErp(): Promise<HasErpUseCase> {
    const remoteConfigProvider = new RemoteConfigProviderFirebase()
    const hasErpUseCase = new HasErpUseCase(remoteConfigProvider)
    return hasErpUseCase
}