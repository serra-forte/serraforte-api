import { RemoteConfigProviderFirebase } from "@/providers/RemoteConfigProvider/implementations/provider-remote-config"
import { IsSystemUpdatingUseCase } from "@/usecases/system/is-system-updating/is-system-updating-usecase"

export async function makeIsSystemUpdating(): Promise<IsSystemUpdatingUseCase> {
    const remoteConfigProvider = new RemoteConfigProviderFirebase()
    const isSystemUpdatingUseCase = new IsSystemUpdatingUseCase(remoteConfigProvider)
    return isSystemUpdatingUseCase
}