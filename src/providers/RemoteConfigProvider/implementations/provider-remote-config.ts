import { firebaseApp } from "@/config/firebase-connection";
import { IRemoteConfigProvider } from "../interface-remote-config-provider";
import { RemoteConfig } from "firebase-admin/lib/remote-config/remote-config";
import { RemoteConfigTemplate, SystemStatus } from "../interface/get-template-response";

export class RemoteConfigProviderFirebase implements IRemoteConfigProvider {
    remoteConfig: RemoteConfig

    constructor(){
        this.remoteConfig = firebaseApp.remoteConfig()
    }
    async getTemplate(templateName: string): Promise<SystemStatus> {
  try {
    const template = await this.remoteConfig.getTemplate();
    const parameters = (template as RemoteConfigTemplate).parameters;

   const param = parameters[templateName as keyof typeof parameters];

    if (!param || !param.defaultValue || typeof param.defaultValue.value !== 'string') {
      throw new Error(`Parâmetro "${templateName}" não está definido corretamente no Remote Config.`);
    }

    const systemStatus: SystemStatus = JSON.parse(param.defaultValue.value);

    return systemStatus;
  } catch (error) {
    console.error(`Erro ao buscar template "${templateName}":`, error);
    throw error;
  }
}


    async updateSystemStatus(isUpdating: boolean): Promise<void> {
      try {
        const template = await this.remoteConfig.getTemplate();

        const parameters = template.parameters;
        const systemStatusParam = parameters['systemStatus' as keyof typeof parameters];

        const newStatus: SystemStatus = {
          isSystemUpdating: isUpdating
        };

        systemStatusParam.defaultValue = {
          value: JSON.stringify(newStatus)
        };
        systemStatusParam.valueType = 'JSON';

        await this.remoteConfig.publishTemplate(template);
      } catch (error) {
        console.error('Erro ao atualizar o status do sistema:', error);
        throw error;
      }
    }

}
