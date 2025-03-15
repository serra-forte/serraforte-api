import { WebHookGetStatusLabelUseCase } from "@/usecases/deliveries/melhor-envio/webhooks/get-status-label-usecase"

export async function makeWebHookGetStatusLabel(): Promise<WebHookGetStatusLabelUseCase>{
    const webHookGetStatusLabelUseCase  = new WebHookGetStatusLabelUseCase()
    return webHookGetStatusLabelUseCase 
}