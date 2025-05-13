import { SystemStatus } from "./interface/get-template-response";

export interface RemoteConfigProvider {
    getTemplate(): Promise<SystemStatus>
    updateSystemStatus(isUpdating: boolean): Promise<void>
}