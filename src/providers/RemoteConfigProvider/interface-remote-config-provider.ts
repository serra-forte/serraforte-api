export interface RemoteConfigProvider {
    getTemplate(): Promise<string>
}