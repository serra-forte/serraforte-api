import { firebaseApp } from "@/config/firebase-connection";
import { RemoteConfigProvider } from "../interface-remote-config-provider";
import { RemoteConfig } from "firebase-admin/lib/remote-config/remote-config";
import { RemoteConfigTemplate, SystemStatus } from "../interface/get-template-response";

export class RemoteConfigProviderFirebase implements RemoteConfigProvider {
    remoteConfig: RemoteConfig

    constructor(){
        this.remoteConfig = firebaseApp.remoteConfig()
    }
    async getTemplate(): Promise<SystemStatus> {
        try {
          const template = await this.remoteConfig.getTemplate();
    
          const systemStatusParam = template as RemoteConfigTemplate;

          const rawValue = systemStatusParam.parameters.systemStatus.defaultValue.value;

          if (typeof rawValue !== 'string') {
          throw new Error('O valor de "systemStatus" não está definido ou não é uma string.');
          }

          const systemStatus: SystemStatus = JSON.parse(rawValue);

          return systemStatus
        } catch (error) {
          console.error('Erro ao buscar template:', error);
          throw error;
        }
    }

    async updateSystemStatus(isUpdating: boolean): Promise<void> {
        try {
          const template = await this.remoteConfig.getTemplate();
    
          const systemStatusParam = template as RemoteConfigTemplate;
    
          const newStatus: SystemStatus = {
            isSystemUpdating: isUpdating
          };
    
          systemStatusParam.parameters.systemStatus = {
            defaultValue: {
              value: JSON.stringify(newStatus)
            },
            valueType: 'JSON'
          };
    
          await this.remoteConfig.publishTemplate(template);
        } catch (error) {
          console.error('Erro ao atualizar o status do sistema:', error);
          throw error;
        }
      }
}