import { IRemoteConfigProvider } from "@/providers/RemoteConfigProvider/interface-remote-config-provider";
import { SystemStatus } from "@/providers/RemoteConfigProvider/interface/get-template-response";

export class HasErpUseCase {
    constructor(
        private remoteConfig: IRemoteConfigProvider
    ){}

    async execute(): Promise<SystemStatus> {
        return await this.remoteConfig.getTemplate('hasErp')
    }
}