import { SystemStatus } from "./interface/get-template-response";

export interface RemoteConfigProvider {
    getTemplate(templateName: string): Promise<SystemStatus>
    updateSystemStatus(isUpdating: boolean): Promise<void>
}