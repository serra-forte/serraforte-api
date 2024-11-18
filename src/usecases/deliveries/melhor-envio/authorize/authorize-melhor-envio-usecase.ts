import { env } from "@/env"

export class AuthorizeMelhorEnvioUsecase {
    async execute(): Promise<string> {
        const params = {
            client_id: env.MELHOR_ENVIO_CLIENT_ID,
            scope: 'cart-read cart-write companies-read companies-write coupons-read coupons-write notifications-read orders-read products-read products-write purchases-read shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking ecommerce-shipping transactions-read users-read users-write',
            state: 'serra-forte',
            redirect_uri: env.MELHOR_REDIRECT_URI,  // Definido ao criar o app
            response_type: 'code',
        }

        const  authorizeUrl = `${env.MELHOR_ENVIO_API_URL}/oauth/authorize?${new URLSearchParams(params).toString()}`
        
        return authorizeUrl
    }
}