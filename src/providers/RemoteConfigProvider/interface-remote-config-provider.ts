import { SystemStatus } from "./interface/get-template-response";

export interface IRemoteConfigProvider {
    getTemplate(templateName: string): Promise<SystemStatus>
    updateSystemStatus(isUpdating: boolean): Promise<void>
}