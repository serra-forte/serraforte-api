import { firebaseApp } from "@/config/firebase-connection";
import { RemoteConfigProvider } from "../interface-remote-config-provider";
import { RemoteConfig } from "firebase-admin/lib/remote-config/remote-config";

export class SystemUpdateUseCase implements RemoteConfigProvider {
    remoteConfig: RemoteConfig

    constructor(){
        this.remoteConfig = firebaseApp.remoteConfig()
    }
    async getTemplate(): Promise<any> {
        const template = await this.remoteConfig.getTemplate()

        console.log(template)
    }
}

const systemUpdateUseCase = new SystemUpdateUseCase()
systemUpdateUseCase.getTemplate()